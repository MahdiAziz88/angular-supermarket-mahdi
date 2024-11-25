import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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

  constructor(private http: HttpClient) {}

  /** Get all cart items */
  getCartItems(): Observable<Cart[]> {
    return this.http.get<Cart[]>(this.cartUrl).pipe(
      tap((cartItems) => console.log('Fetched cart items:', cartItems)),
      catchError(this.handleError<Cart[]>('getCartItems', []))
    );
  }

  /** Add an item to the cart */
  addItemToCart(item: Item): Observable<Cart> {
    const newCartItem = { itemId: item.id, quantity: 1 }; // Do not include `id`, let the API handle it
    console.log('Adding new cart item without ID:', newCartItem);
    return this.http.post<Cart>(this.cartUrl, newCartItem, this.httpOptions).pipe(
      tap((cartItem) => console.log(`Added cart item with generated id=${cartItem.id}`)),
      catchError(this.handleError<Cart>('addItemToCart'))
    );
  }

  /** Update quantity of an item in the cart */
  updateItemQuantity(cartId: number, quantity: number): Observable<Cart> {
    const url = `${this.cartUrl}/${cartId}`;
    return this.http.put<Cart>(url, { quantity }, this.httpOptions).pipe(
      tap(() => console.log(`Updated cart item id=${cartId} with quantity=${quantity}`)),
      catchError(this.handleError<Cart>('updateItemQuantity'))
    );
  }

  /** Remove an item from the cart */
  removeItemFromCart(cartId: number): Observable<void> {
    const url = `${this.cartUrl}/${cartId}`;
    return this.http.delete<void>(url, this.httpOptions).pipe(
      tap(() => console.log(`Removed cart item with id=${cartId}`)),
      catchError(this.handleError<void>('removeItemFromCart'))
    );
  }

  /** Clear all items from the cart */
  clearCart(): Observable<void> {
    return this.http.delete<void>(this.cartUrl, this.httpOptions).pipe(
      tap(() => console.log('Cleared cart')),
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
