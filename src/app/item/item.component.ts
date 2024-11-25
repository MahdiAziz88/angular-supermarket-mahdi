import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CartService } from '../cart.service';
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

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.checkIfInCart();
  }

  checkIfInCart(): void {
    console.log(`Checking if item ${this.item.id} is in the cart.`);
    this.cartService.getCartItems().subscribe((cartItems) => {
      console.log('Cart items:', cartItems);
      this.isInCart = cartItems.some((cartItem) => cartItem.itemId === this.item.id);
      console.log(`Item ${this.item.id} is ${this.isInCart ? 'in' : 'not in'} the cart.`);
    });
  }

  toggleCartItemChecked(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    console.log(`Toggle item ${this.item.id} to ${isChecked ? 'add' : 'remove'} in cart.`);
    if (isChecked) {
      this.addItemToCart();
    } else {
      this.removeItemFromCart();
    }
  }

  addItemToCart(): void {
    console.log(`Adding item ${this.item.id} to the cart.`);
    this.cartService.addItemToCart(this.item).subscribe(() => {
      console.log(`Item ${this.item.id} successfully added to the cart.`);
      this.isInCart = true;
    }, (error) => {
      console.error(`Failed to add item ${this.item.id} to the cart:`, error);
    });
  }

  removeItemFromCart(): void {
    console.log(`Removing item ${this.item.id} from the cart.`);
    this.cartService.getCartItems().subscribe((cartItems) => {
      const cartItem = cartItems.find((cartItem) => cartItem.itemId === this.item.id);
      if (cartItem) {
        this.cartService.removeItemFromCart(cartItem.id).subscribe(() => {
          console.log(`Item ${this.item.id} successfully removed from the cart.`);
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
    console.log(`Editing item ${this.item.id}.`);
    this.edit.emit(this.item);
  }

  onDelete(): void {
    console.log(`Deleting item ${this.item.id}.`);
    this.delete.emit(this.item.id);
  }
}
