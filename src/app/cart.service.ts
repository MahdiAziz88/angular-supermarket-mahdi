import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Item } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartUrl = 'api/cart'; // URL to web api
  private itemsUrl = 'api/items'; // URL to items api
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.updateCartCount();
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
  addItemToCart(item: Item): Observable<void> {
    const cartItem = { itemId: item.id, quantity: 1 };
    return this.http.post<void>(this.cartUrl, cartItem).pipe(
      map(() => this.updateCartCount())
    );
  }

  // Update item quantity in the cart
  updateQuantity(itemId: number, quantity: number): Observable<void> {
    return this.http.put<void>(`${this.cartUrl}/${itemId}`, { quantity }).pipe(
      map(() => this.updateCartCount())
    );
  }

  // Remove an item from the cart
  removeItemFromCart(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.cartUrl}/${itemId}`).pipe(
      map(() => this.updateCartCount())
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
}