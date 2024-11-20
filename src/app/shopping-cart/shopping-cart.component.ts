import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Item } from '../interfaces';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  cartItems: { item: Item; quantity: number }[] = [];
  total: number = 0;

  constructor(public cartService: CartService) {}

  ngOnInit(): void {
    this.refreshCart();
  }

  refreshCart(): void {
    this.cartService.getCartItems().subscribe(cartItems => {
      this.cartItems = cartItems;
      this.calculateTotal();
    });
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce(
      (sum, cartItem) => sum + cartItem.item.price * cartItem.quantity,
      0
    );
  }

  updateQuantity(itemId: number, quantity: number): void {
    this.cartService.updateQuantity(itemId, quantity).subscribe(() => {
      this.refreshCart();
    });
  }

  removeItemFromCart(itemId: number): void {
    this.cartService.removeItemFromCart(itemId).subscribe(() => {
      this.refreshCart();
    });
  }
}