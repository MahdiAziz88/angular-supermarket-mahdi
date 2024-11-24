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

  private loadInitialCartItems(): void {
    this.getCartItemsFromServer().subscribe((cartItems) => {
      this.cartItemsSubject.next(cartItems);
      this.cartCountSubject.next(cartItems.length);
    });
  }

  getCartItems(): Observable<Cart[]> {
    return this.cartItemsSubject.asObservable();
  }

  getCartCount(): Observable<number> {
    return this.cartCountSubject.asObservable();
  }

  private getCartItemsFromServer(): Observable<Cart[]> {
    return this.http.get<Cart[]>(this.cartUrl).pipe(
      tap(() => console.log('Fetched cart items')),
      catchError(this.handleError<Cart[]>('getCartItems', []))
    );
  }

  addCartItem(cartItem: Cart): Observable<Cart> {
    return this.http.post<Cart>(this.cartUrl, { ...cartItem, id: undefined }, this.httpOptions).pipe(
      tap((newCartItem: Cart) => {
        console.log(`Added cart item with id=${newCartItem.id}`);
        this.updateCartState();
      }),
      catchError(this.handleError<Cart>('addCartItem'))
    );
  }

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

  private updateCartState(): void {
    this.getCartItemsFromServer().subscribe((cartItems) => {
      this.cartItemsSubject.next(cartItems);
      this.cartCountSubject.next(cartItems.length);
    });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
}