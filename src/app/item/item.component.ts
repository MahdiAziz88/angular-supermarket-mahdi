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
  isInCart: boolean = false;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.checkIfItemInCart();
  }

  checkIfItemInCart(): void {
    this.cartService.getCartItems().subscribe(cartItems => {
      this.isInCart = cartItems.some(cartItem => cartItem.item.id === this.item.id);
    });
  }

  toggleCartItemChecked(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.addToCart();
    } else {
      this.removeFromCart();
    }
  }

  addToCart(): void {
    if (!this.isInCart) {
      this.cartService.addItemToCart(this.item).subscribe(
        () => {
          this.isInCart = true;
        },
        (error) => {
          console.error('Error adding item to cart:', error);
        }
      );
    }
  }

  removeFromCart(): void {
    if (this.isInCart) {
      this.cartService.removeItemFromCart(this.item.id).subscribe(
        () => {
          this.isInCart = false;
        },
        (error) => {
          console.error('Error removing item from cart:', error);
        }
      );
    }
  }

  onEdit(): void {
    this.edit.emit(this.item); // Emits the item object (makes it visible to the parent component (Itemlist))
  }

  onDelete(): void {
    if (this.item.id !== undefined) {
      this.delete.emit(this.item.id); // Emits the item's ID
    }
  }
}
