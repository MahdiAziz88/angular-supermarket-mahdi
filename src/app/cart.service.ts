import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { Item } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartUrl = 'api/cart'; // URL to web api
  private itemsUrl = 'api/items'; // URL to items api
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();
  private nextId = 1; // Local counter for generating new IDs

  constructor(private http: HttpClient) {
    this.updateCartCount();
    this.initializeNextId();
  }

  // Initialize the next ID based on the existing cart items
  private initializeNextId(): void {
    this.http.get<{ id: number }[]>(this.cartUrl).subscribe(cartItems => {
      if (cartItems.length > 0) {
        this.nextId = Math.max(...cartItems.map(cartItem => cartItem.id)) + 1;
      }
    });
  }

  // Get all cart items
  getCartItems(): Observable<{ item: Item; quantity: number }[]> {
    return this.http.get<{ itemId: number; quantity: number }[]>(this.cartUrl).pipe(
      map(cart => cart.map(cartItem => ({
        item: this.getItemById(cartItem.itemId),
        quantity: cartItem.quantity
      }))),
      mergeMap(cartItems => forkJoin(cartItems.map(cartItem => 
        cartItem.item.pipe(map(item => ({ item, quantity: cartItem.quantity })))
      )))
    );
  }

  // Add an item to the cart
  addItemToCart(item: Item): Observable<{ id: number; itemId: number; quantity: number }> {
    const cartItem = { id: this.nextId++, itemId: item.id, quantity: 1 };
    console.log('Adding item to cart:', cartItem); // Add logging here
    return this.http.post<{ id: number; itemId: number; quantity: number }>(this.cartUrl, cartItem).pipe(
      tap(() => this.updateCartCount()),
      catchError(this.handleError<{ id: number; itemId: number; quantity: number }>('addItemToCart'))
    );
  }

  // Update item quantity in the cart
  updateQuantity(itemId: number, quantity: number): Observable<{ itemId: number; quantity: number }> {
    return this.http.put<{ itemId: number; quantity: number }>(`${this.cartUrl}/${itemId}`, { quantity }).pipe(
      tap(() => this.updateCartCount()),
      catchError(this.handleError<{ itemId: number; quantity: number }>('updateQuantity'))
    );
  }

  // Remove an item from the cart
  removeItemFromCart(itemId: number): Observable<{ itemId: number }> {
    return this.http.delete<{ itemId: number }>(`${this.cartUrl}/${itemId}`).pipe(
      tap(() => this.updateCartCount()),
      catchError(this.handleError<{ itemId: number }>('removeItemFromCart'))
    );
  }

  // Helper method to get item by ID
  private getItemById(itemId: number): Observable<Item> {
    return this.http.get<Item>(`${this.itemsUrl}/${itemId}`);
  }

  // Update cart count
  private updateCartCount(): void {
    this.getCartItems().subscribe(cartItems => {
      const count = cartItems.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
      this.cartCountSubject.next(count);
    });
  }

  // Handle HTTP operation that failed.
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}