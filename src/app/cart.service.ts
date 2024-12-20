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
  private cartItemsSubject = new BehaviorSubject<Cart[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable(); // Expose as observable

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {
    this.refreshCart();
  }

  /** Refresh cart count */
  private refreshCart(): void {
    this.getCartItems().subscribe((cartItems) => {
      this.cartItemsSubject.next(cartItems);
    });
  }


   /** Get all cart items */
   getCartItems(): Observable<Cart[]> {
    return this.http.get<Cart[]>(this.cartUrl).pipe(
      tap((cartItems) => {
        console.log('Fetched cart items:', cartItems);
      }),
      catchError(this.handleError<Cart[]>('getCartItems', []))
    );
  }

  /** Add an item to the cart */
  addItemToCart(item: Item): Observable<Cart> {
    const newCartItem = { itemId: item.id, quantity: 1 };
    return this.http.post<Cart>(this.cartUrl, newCartItem, this.httpOptions).pipe(
      tap(() => this.refreshCart()), // Refresh cart state after adding
      catchError(this.handleError<Cart>('addItemToCart'))
    );
  }

  /** Update quantity of an item in the cart */
  updateItemQuantity(cartId: number, itemId: number, quantity: number): Observable<Cart> {
    const url = `${this.cartUrl}/${cartId}`;
    const updatedCartItem = { id: cartId, itemId: itemId, quantity: quantity };
    return this.http.put<Cart>(url, updatedCartItem, this.httpOptions).pipe(
      tap(() => this.refreshCart()), // Refresh cart state after updating
      catchError(this.handleError<Cart>('updateItemQuantity'))
    );
  }
  
  
  /** Remove an item from the cart */
  removeItemFromCart(cartId: number): Observable<void> {
    const url = `${this.cartUrl}/${cartId}`;
    return this.http.delete<void>(url, this.httpOptions).pipe(
      tap(() => this.refreshCart()), // Refresh cart state after removing
      catchError(this.handleError<void>('removeItemFromCart'))
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
