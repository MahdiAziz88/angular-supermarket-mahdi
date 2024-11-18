import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { ItemService } from '../item.service';
import { Item } from '../interfaces';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  cartItems: { item: Item; quantity: number }[] = [];
  total: number = 0;

  constructor(public cartService: CartService, private itemService: ItemService) {}

  ngOnInit(): void {
    // Listen for item updates and reflect changes in the cart
    this.itemService.getItems().subscribe((latestItems) => {
      latestItems.forEach((updatedItem) => {
        this.cartService.handleItemUpdate(updatedItem);
      });
      this.refreshCart();
    });
  }

  refreshCart(): void {
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce(
      (sum, cartItem) => sum + cartItem.item.price * cartItem.quantity,
      0
    );
  }

  updateQuantity(itemId: number, quantity: number): void {
    this.cartService.updateQuantity(itemId, quantity);
    this.calculateTotal();
  }

  removeItemFromCart(itemId: number): void {
    this.cartService.removeItemFromCart(itemId);
    this.refreshCart();
  }
}

