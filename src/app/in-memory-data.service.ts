import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Item, Category, Cart } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const items: Item[] = [
      { id: 1, name: 'White Bread', price: 0.3, category: 'Bakery' },
      { id: 2, name: 'Mega Chips', price: 0.1, category: 'Snacks' },
      { id: 3, name: 'Croissant', price: 0.1, category: 'Bakery' },
      { id: 4, name: 'Alsi Cola', price: 0.25, category: 'Drinks' },
      { id: 5, name: 'Biscuit', price: 0.2, category: 'Snacks' },
      { id: 6, name: 'Viva', price: 0.3, category: 'Drinks' },
      { id: 7, name: 'OK Chips', price: 0.1, category: 'Snacks' },
      { id: 8, name: 'Cheese Sandwich', price: 0.35, category: 'Bakery' },
      { id: 9, name: 'Cup Cake', price: 0.5, category: 'Bakery' },
    ];

    const categories: Category[] = [
      { id: 11, name: 'Bakery' },
      { id: 12, name: 'Drinks' },
      { id: 13, name: 'Snacks' },
    ];

    const cart: { id: number, itemId: number; quantity: number }[] = [];

    return { items, categories, cart };
  }
}