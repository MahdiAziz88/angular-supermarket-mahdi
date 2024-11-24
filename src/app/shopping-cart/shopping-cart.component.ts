import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { ItemService } from '../item.service';
import { Cart, Item } from '../interfaces';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  cartItems: Cart[] = [];
  total: number = 0;

  constructor(private cartService: CartService, private itemService: ItemService) {}

  ngOnInit(): void {
    this.refreshCart();
  }

  refreshCart(): void {
    this.cartService.getCartItems().subscribe((cartItems) => {
      this.cartItems = cartItems;
      this.calculateTotal();
    });
  }

  getItemById(itemId: number): Observable<Item | null> {
    return this.itemService.getItem(itemId).pipe(catchError(() => of(null)));
  }

  calculateTotal(): void {
    this.total = 0;
    this.cartItems.forEach((cartItem) => {
      this.getItemById(cartItem.itemId).subscribe((item) => {
        if (item) {
          this.total += item.price * cartItem.quantity;
        }
      });
    });
  }

  updateQuantity(cartItem: Cart, quantity: string | number): void {
    const newQuantity = Number(quantity);
    if (newQuantity > 0) {
      const updatedCartItem = { ...cartItem, quantity: newQuantity };
      this.cartService.updateCartItem(updatedCartItem).subscribe(() => {
        this.calculateTotal();
      });
    } else {
      this.removeItemFromCart(cartItem.id);
    }
  }

  removeItemFromCart(cartItemId: number): void {
    this.cartService.deleteCartItem(cartItemId).subscribe(() => {
      this.refreshCart();
    });
  }
}