import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Item, Category } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private itemsUrl = 'api/items';
  private categoriesUrl = 'api/categories';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  // Fetch items
  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.itemsUrl).pipe(
      tap(() => console.log('Fetched items')),
      catchError(this.handleError<Item[]>('getItems', []))
    );
  }

  // Fetch items by category
  getItemsByCategory(categoryName: string): Observable<Item[]> {
    const url = `${this.itemsUrl}/?category=${encodeURIComponent(categoryName)}`;
    return this.http.get<Item[]>(url).pipe(
      tap(() => console.log(`Fetched items for category: ${categoryName}`)),
      catchError(this.handleError<Item[]>('getItemsByCategory', []))
    );
  }

  // Fetch categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl).pipe(
      tap(() => console.log('Fetched categories')),
      catchError(this.handleError<Category[]>('getCategories', []))
    );
  }

  // Add a new item
  addItem(item: Item): Observable<Item> {
    return this.http.post<Item>(this.itemsUrl, { ...item, id: undefined }, this.httpOptions).pipe(
      tap((newItem: Item) => console.log(`Added item with id=${newItem.id}`)),
      catchError(this.handleError<Item>('addItem'))
    );
  }
  

  // Update an existing item
  updateItem(item: Item): Observable<any> {
    const url = `${this.itemsUrl}/${item.id}`;
    return this.http.put(url, item, this.httpOptions).pipe(
      tap(() => console.log(`Updated item id=${item.id}`)),
      catchError(this.handleError<any>('updateItem'))
    );
  }

  // Delete an item
  deleteItem(id: number): Observable<void> {
    const url = `${this.itemsUrl}/${id}`;
    return this.http.delete<void>(url, this.httpOptions).pipe(
      tap(() => console.log(`Deleted item with id=${id}`)),
      catchError(this.handleError<void>('deleteItem'))
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
