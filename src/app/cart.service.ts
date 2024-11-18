import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Item } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: { item: Item; quantity: number }[] = [];
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor() {
    this.updateCartCount(); // Initialize the cart count
  }

  // Update the cart count observable
  private updateCartCount() {
    const totalItems = this.getTotalItems();
    this.cartCountSubject.next(totalItems);
  }

  // Get all cart items
  getCartItems(): { item: Item; quantity: number }[] {
    return this.cartItems;
  }

  // Add an item to the cart
  addItemToCart(item: Item): void {
    const existingItem = this.cartItems.find((ci) => ci.item.id === item.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cartItems.push({ item, quantity: 1 });
    }
    this.updateCartCount();
  }

  // Remove an item from the cart
  removeItemFromCart(itemId: number): void {
    this.cartItems = this.cartItems.filter((ci) => ci.item.id !== itemId);
    this.updateCartCount();
  }

  // Check if an item is in the cart
  isItemInCart(itemId: number): boolean {
    return this.cartItems.some((ci) => ci.item.id === itemId);
  }

  // Update the quantity of an item in the cart
  updateQuantity(itemId: number, quantity: number): void {
    const cartItem = this.cartItems.find((ci) => ci.item.id === itemId);
    if (cartItem) {
      cartItem.quantity = quantity > 0 ? quantity : 1;
    }
    this.updateCartCount();
  }

  // Clear all items from the cart
  clearCart(): void {
    this.cartItems = [];
    this.updateCartCount();
  }

  // Get the total number of items in the cart
  getTotalItems(): number {
    return this.cartItems.reduce((total, ci) => total + ci.quantity, 0);
  }

  // Get the total price of items in the cart
  getTotalPrice(): number {
    return this.cartItems.reduce((total, ci) => total + ci.item.price * ci.quantity, 0);
  }

  // Handle item updates in the cart
  handleItemUpdate(updatedItem: Item): void {
    const cartItem = this.cartItems.find((ci) => ci.item.id === updatedItem.id);
    if (cartItem) {
      cartItem.item = updatedItem; // Replace the cart item with the updated item
    }
  }

  // Handle item deletion in the cart
  handleItemDelete(deletedItemId: number): void {
    this.removeItemFromCart(deletedItemId); // Remove the item from the cart
  }
}