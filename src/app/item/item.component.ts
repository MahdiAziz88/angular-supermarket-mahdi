import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Item } from '../interfaces';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
})
export class ItemComponent {
  @Input() item!: Item;
  @Output() edit = new EventEmitter<Item>();
  @Output() delete = new EventEmitter<number>();

  constructor(public cartService: CartService) {}

  toggleCartItemChecked(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.cartService.addItemToCart(this.item);
    } else {
      this.cartService.removeItemFromCart(this.item.id);
    }
  }

  isItemInCart(): boolean {
    return this.cartService.isItemInCart(this.item.id);
  }

  onEdit() {
    this.edit.emit(this.item);
  }

  onDelete() {
    if (this.item.id !== undefined) {
      this.delete.emit(this.item.id);
    }
  }
}
