import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Cart } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartUrl = 'api/cart';
  private cartItemsSubject = new BehaviorSubject<Cart[]>([]);
  private cartCountSubject = new BehaviorSubject<number>(0);

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {
    this.loadInitialCartItems();
  }

  /**
   * Loads the initial cart items from the server and updates the BehaviorSubject.
   */
  private loadInitialCartItems(): void {
    this.fetchCartItems().subscribe((cartItems) => {
      this.cartItemsSubject.next(cartItems);
      this.cartCountSubject.next(cartItems.length);
    });
  }

  /**
   * Returns an observable of the current cart items stored in the BehaviorSubject.
   */
  getCartItems(): Observable<Cart[]> {
    return this.cartItemsSubject.asObservable();
  }

  /**
   * Returns an observable of the current cart count stored in the BehaviorSubject.
   */
  getCartCount(): Observable<number> {
    return this.cartCountSubject.asObservable();
  }

  /**
   * Fetches the cart items from the server and updates the BehaviorSubject.
   */
  fetchCartItems(): Observable<Cart[]> {
    return this.http.get<Cart[]>(this.cartUrl).pipe(
      tap((cartItems) => {
        this.cartItemsSubject.next(cartItems);
        this.cartCountSubject.next(cartItems.length);
        console.log('Fetched cart items');
      }),
      catchError(this.handleError<Cart[]>('fetchCartItems', []))
    );
  }

  /**
   * Adds a new cart item to the server and updates the cart state.
   * @param cartItem The cart item to add.
   */
  addCartItem(cartItem: Cart): Observable<Cart> {
    return this.http.post<Cart>(this.cartUrl, { ...cartItem, id: undefined }, this.httpOptions).pipe(
      tap((newCartItem: Cart) => {
        console.log(`Added cart item with id=${newCartItem.id}`);
        this.updateCartState();
      }),
      catchError(this.handleError<Cart>('addCartItem'))
    );
  }

  /**
   * Updates an existing cart item on the server and updates the cart state.
   * @param cartItem The cart item to update.
   */
  updateCartItem(cartItem: Cart): Observable<any> {
    const url = `${this.cartUrl}/${cartItem.id}`;
    return this.http.put(url, cartItem, this.httpOptions).pipe(
      tap(() => {
        console.log(`Updated cart item id=${cartItem.id}`);
        this.updateCartState();
      }),
      catchError(this.handleError<any>('updateCartItem'))
    );
  }

  /**
   * Deletes a cart item from the server and updates the cart state.
   * @param id The ID of the cart item to delete.
   */
  deleteCartItem(id: number): Observable<void> {
    const url = `${this.cartUrl}/${id}`;
    return this.http.delete<void>(url, this.httpOptions).pipe(
      tap(() => {
        console.log(`Deleted cart item with id=${id}`);
        this.updateCartState();
      }),
      catchError(this.handleError<void>('deleteCartItem'))
    );
  }

  /**
   * Refreshes the cart state by fetching the cart items from the server and updating the BehaviorSubject.
   */
  private updateCartState(): void {
    this.fetchCartItems().subscribe();
  }

  /**
   * Handles HTTP operation errors and logs them to the console.
   * @param operation The name of the operation that failed.
   * @param result The optional value to return as the observable result.
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
}