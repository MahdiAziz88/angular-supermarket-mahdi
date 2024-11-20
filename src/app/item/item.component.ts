import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CartService } from '../cart.service';
import { Item } from '../interfaces';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
})
export class ItemComponent implements OnInit {
  @Input() item!: Item;
  @Output() edit = new EventEmitter<Item>();
  @Output() delete = new EventEmitter<number>();
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
    this.edit.emit(this.item);
  }

  onDelete(): void {
    if (this.item.id !== undefined) {
      this.delete.emit(this.item.id);
    }
  }
}
