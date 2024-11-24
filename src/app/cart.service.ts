import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Cart } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartUrl = 'api/cart';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  // Get all cart items
  getCartItems(): Observable<Cart[]> {
    return this.http.get<Cart[]>(this.cartUrl).pipe(
      tap(() => console.log('Fetched cart items')),
      catchError(this.handleError<Cart[]>('getCartItems', []))
    );
  }

  // Add a new cart item
  addCartItem(cartItem: Cart): Observable<Cart> {
    return this.http.post<Cart>(this.cartUrl, { ...cartItem, id: undefined }, this.httpOptions).pipe(
      tap((newCartItem: Cart) => console.log(`Added cart item with id=${newCartItem.id}`)),
      catchError(this.handleError<Cart>('addCartItem'))
    );
  }

  // Update an existing cart item
  updateCartItem(cartItem: Cart): Observable<any> {
    const url = `${this.cartUrl}/${cartItem.id}`;
    return this.http.put(url, cartItem, this.httpOptions).pipe(
      tap(() => console.log(`Updated cart item id=${cartItem.id}`)),
      catchError(this.handleError<any>('updateCartItem'))
    );
  }

  // Delete a cart item
  deleteCartItem(id: number): Observable<void> {
    const url = `${this.cartUrl}/${id}`;
    return this.http.delete<void>(url, this.httpOptions).pipe(
      tap(() => console.log(`Deleted cart item with id=${id}`)),
      catchError(this.handleError<void>('deleteCartItem'))
    );
  }

  // Error handler
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
}