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
    this.cartService.getCartItems().subscribe((cartItems) => {
      this.cartItems = cartItems;
      this.fetchItemDetails();
    });
  }

  fetchItemDetails(): void {
    this.cartItems.forEach((cartItem) => {
      this.itemService.getItem(cartItem.itemId).subscribe((item) => {
        this.itemDetails[cartItem.itemId] = item;
        this.calculateTotal(); // Calculate total after fetching item details
      });
    });
  }

  calculateTotal(): void {
    this.total = 0;
    this.cartItems.forEach((cartItem) => {
      const item = this.itemDetails[cartItem.itemId];
      if (item) {
        this.total += item.price * cartItem.quantity;
      }
    });
  }

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

  removeItemFromCart(cartItemId: number): void {
    this.cartService.deleteCartItem(cartItemId).subscribe(() => {
      this.cartItems = this.cartItems.filter(item => item.id !== cartItemId);
      delete this.itemDetails[cartItemId];
      this.calculateTotal();
    });
  }
}