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
  items: Item[] = [];
  cartItems: Cart[] = [];
  cartDetails: { cart: Cart; item: Item }[] = [];

  constructor(private cartService: CartService, private itemService: ItemService) {}

  ngOnInit(): void {
    this.loadCartData();
  }

  private loadCartData(): void {
    // Fetch items
    this.itemService.getItems().subscribe((items: Item[]) => {
      this.items = items;

      // Fetch cart items
      this.cartService.getCartItems().subscribe((cartItems: Cart[]) => {
        this.cartItems = cartItems;
        this.updateCartDetails();
      });
    });
  }

  private updateCartDetails(): void {
    this.cartDetails = this.cartItems
      .map((cartItem) => {
        const item = this.items.find((i) => i.id === cartItem.itemId);
        return item ? { cart: cartItem, item } : null;
      })
      .filter((entry) => entry !== null) as { cart: Cart; item: Item }[];
  }

  addItemToCart(item: Item): void {
    this.cartService.addItemToCart(item).subscribe(() => {
      this.loadCartData(); // Reload cart data to update UI
    });
  }

  updateQuantity(cartId: number, itemId: number, quantity: number): void {
    this.cartService.updateItemQuantity(cartId, itemId, quantity).subscribe({
      next: (updatedCart) => console.log('Cart updated successfully'),
      error: (err) => console.error('Error updating cart:', err),
    });
  }
  

  removeItem(cartId: number): void {
    this.cartService.removeItemFromCart(cartId).subscribe(() => {
      this.loadCartData(); // Reload cart data to update UI
    });
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice(this.cartItems, this.items);
  }
}
