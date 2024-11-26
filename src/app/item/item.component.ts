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
  @Input() isInCart: boolean = false; // Receive cart status from the parent

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // this.checkIfInCart();
  }

  // checkIfInCart(): void {
  //   this.cartService.getCartItems().subscribe((cartItems) => {
  //     this.isInCart = cartItems.some((cartItem) => cartItem.itemId === this.item.id);
  //   });
  // }

toggleCartItemChecked(): void {
  this.item.isInCart = !this.item.isInCart; // Toggle the state

  if (this.item.isInCart) {
    this.cartService.addItemToCart(this.item).subscribe();
  } else {
    this.cartService.removeItemFromCart(this.item.id).subscribe();
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

  onDelete(): void {
    this.delete.emit(this.item.id);
  }
}
