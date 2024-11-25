import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Cart, Item } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartUrl = 'api/cart'; // URL for cart API
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private cartCountSubject = new BehaviorSubject<number>(0); // Cart count as a BehaviorSubject
  cartCount$ = this.cartCountSubject.asObservable(); // Expose as an observable


  constructor(private http: HttpClient) {
    this.refreshCartCount();
  }

  /** Refresh cart count */
  private refreshCartCount(): void {
    this.getCartItems().subscribe((cartItems) => {
      this.updateCartCount(cartItems);
    });
  }

  /** Update cart count */
  private updateCartCount(cartItems: Cart[]): void {
    const totalItems = this.getTotalItems(cartItems);
    this.cartCountSubject.next(totalItems); // Emit the updated count
  }

   /** Get all cart items */
   getCartItems(): Observable<Cart[]> {
    return this.http.get<Cart[]>(this.cartUrl).pipe(
      tap((cartItems) => {
        console.log('Fetched cart items:', cartItems);
        this.updateCartCount(cartItems); // Update cart count whenever items are fetched
      }),
      catchError(this.handleError<Cart[]>('getCartItems', []))
    );
  }

  /** Add an item to the cart */
  addItemToCart(item: Item): Observable<Cart> {
    const newCartItem = { itemId: item.id, quantity: 1 }; // Do not include `id`, let the API handle it
    console.log('Adding new cart item without ID:', newCartItem);
    return this.http.post<Cart>(this.cartUrl, newCartItem, this.httpOptions).pipe(
      tap((cartItem) => {
        console.log(`Added cart item with generated id=${cartItem.id}`);
        this.refreshCartCount(); // Refresh cart count after adding
      }),
      catchError(this.handleError<Cart>('addItemToCart'))
    );
  }

  /** Update quantity of an item in the cart */
  updateItemQuantity(cartId: number, itemId: number, quantity: number): Observable<Cart> {
    const url = `${this.cartUrl}/${cartId}`;
    const payload = { id: cartId, itemId: itemId, quantity: quantity }; // Payload keeps id and itemId unchanged, updates quantity
    console.log('Sending update request to:', url);
    console.log('Payload:', payload);
  
    return this.http.put<Cart>(url, payload, this.httpOptions).pipe(
      tap((updatedCart) => console.log('Updated cart item:', updatedCart)),
      catchError(this.handleError<Cart>('updateItemQuantity'))
    );
  }
  
  
  

  /** Remove an item from the cart */
  removeItemFromCart(cartId: number): Observable<void> {
    const url = `${this.cartUrl}/${cartId}`;
    return this.http.delete<void>(url, this.httpOptions).pipe(
      tap(() => {
        console.log(`Removed cart item with id=${cartId}`);
        this.refreshCartCount(); // Refresh cart count after removing
      }),
      catchError(this.handleError<void>('removeItemFromCart'))
    );
  }

  /** Clear all items from the cart */
  clearCart(): Observable<void> {
    return this.http.delete<void>(this.cartUrl, this.httpOptions).pipe(
      tap(() => {
        console.log('Cleared cart');
        this.cartCountSubject.next(0); // Reset cart count directly
      }),
      catchError(this.handleError<void>('clearCart'))
    );
  }

  /** Calculate the total number of items in the cart */
  getTotalItems(cartItems: Cart[]): number {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  /** Calculate the total price of items in the cart */
  getTotalPrice(cartItems: Cart[], items: Item[]): number {
    return cartItems.reduce((total, cartItem) => {
      const item = items.find((i) => i.id === cartItem.itemId);
      return item ? total + item.price * cartItem.quantity : total;
    }, 0);
  }

  /** Handle HTTP operation errors */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
}
