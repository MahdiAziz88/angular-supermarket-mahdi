import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { ItemService } from '../item.service';
import { Cart, Item } from '../interfaces';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  cartItems: Cart[] = [];
  itemDetails: { [key: number]: Item } = {}; // Map to store item details
  total: number = 0;

  constructor(private cartService: CartService, private itemService: ItemService) {}

  ngOnInit(): void {
    // Subscribe to cart items and fetch item details on initialization
    this.cartService.getCartItems().subscribe((cartItems) => {
      this.cartItems = cartItems;
      this.fetchItemDetails();
    });
  }

  /**
   * Fetches details for each item in the cart.
   * This method subscribes to the item service to get item details
   * and stores them in the itemDetails map.
   */
  fetchItemDetails(): void {
    this.cartItems.forEach((cartItem) => {
      this.itemService.getItem(cartItem.itemId).subscribe((item) => {
        this.itemDetails[cartItem.itemId] = item;
        this.calculateTotal(); // Calculate total after fetching item details
      });
    });
  }

  /**
   * Calculates the total price of all items in the cart.
   * This method iterates over the cart items and sums up the total price.
   */
  calculateTotal(): void {
    this.total = 0;
    this.cartItems.forEach((cartItem) => {
      const item = this.itemDetails[cartItem.itemId];
      if (item) {
        this.total += item.price * cartItem.quantity;
      }
    });
  }

  /**
   * Updates the quantity of a specific cart item.
   * This method updates the quantity of the cart item and recalculates the total.
   * If the new quantity is zero, the item is removed from the cart.
   * @param cartItem The cart item to update.
   * @param quantity The new quantity value.
   */
  updateQuantity(cartItem: Cart, quantity: string | number): void {
    const newQuantity = Number(quantity);
    if (newQuantity > 0) {
      cartItem.quantity = newQuantity;
      this.cartService.updateCartItem(cartItem).subscribe(() => {
        this.calculateTotal(); // Recalculate total after updating quantity
      });
    } else {
      this.removeItemFromCart(cartItem.id);
    }
  }

  /**
   * Removes a specific item from the cart.
   * This method deletes the cart item from the server and updates the cart state.
   * @param cartItemId The ID of the cart item to remove.
   */
  removeItemFromCart(cartItemId: number): void {
    this.cartService.deleteCartItem(cartItemId).subscribe(() => {
      // Update the cart items and item details after deletion
      this.cartItems = this.cartItems.filter(item => item.id !== cartItemId);
      delete this.itemDetails[cartItemId];
      this.calculateTotal();
    });
  }
}