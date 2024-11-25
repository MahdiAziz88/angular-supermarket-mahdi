import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CartService } from '../cart.service';
import { ItemService } from '../item.service';
import { Item } from '../interfaces';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
})
export class ItemComponent implements OnInit {
  @Input() item!: Item; // Receives the item to display
  @Output() edit = new EventEmitter<Item>(); // Emits the item to be edited
  @Output() delete = new EventEmitter<number>(); // Emits the ID of the item to be deleted

  isInCart = false; // Tracks whether the item is in the cart

  constructor(private cartService: CartService, private itemService: ItemService) {}

  ngOnInit(): void {
    this.checkIfInCart();
  }

  checkIfInCart(): void {
    this.cartService.getCartItems().subscribe((cartItems) => {
      this.isInCart = cartItems.some((cartItem) => cartItem.itemId === this.item.id);
    });
  }

  toggleCartItemChecked(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.addItemToCart();
    } else {
      this.removeItemFromCart();
    }
  }

  addItemToCart(): void {
    this.cartService.addItemToCart(this.item).subscribe(() => {
      this.isInCart = true;
    }, (error) => {
      console.error(`Failed to add item ${this.item.id} to the cart:`, error);
    });
  }

  removeItemFromCart(): void {
    this.cartService.getCartItems().subscribe((cartItems) => {
      const cartItem = cartItems.find((cartItem) => cartItem.itemId === this.item.id);
      if (cartItem) {
        this.cartService.removeItemFromCart(cartItem.id).subscribe(() => {
          this.isInCart = false;
        }, (error) => {
          console.error(`Failed to remove item ${this.item.id} from the cart:`, error);
        });
      } else {
        console.warn(`Item ${this.item.id} not found in the cart for removal.`);
      }
    });
  }

  onEdit(): void {
    this.edit.emit(this.item);
  }

  onDelete(): void {4
    this.delete.emit(this.item.id); // Emit the ID of the item to be deleted
    this.itemService.deleteItem(this.item.id).subscribe(() => {}); // Delete the item
    this.removeItemFromCart(); // Remove the item from the cart if it's deleted
  }
}
