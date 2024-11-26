import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Item } from '../interfaces';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
})
export class ItemListComponent {
  @Input() items: Item[] = [];
  @Input() cartItems: any[] = [];
  @Output() editItem = new EventEmitter<Item>();
  @Output() deleteItem = new EventEmitter<number>();
  @Output() toggleCartItem = new EventEmitter<{ item: Item; addToCart: boolean }>();

  itemInCart(item: Item): boolean {
    return this.cartItems.some((cartItem) => cartItem.itemId === item.id);
  }

  onEditItem(item: Item): void {
    this.editItem.emit(item);
  }

  onDeleteItem(itemId: number): void {
    this.deleteItem.emit(itemId);
  }

  onToggleCartItem(item: Item, addToCart: boolean): void {
    this.toggleCartItem.emit({ item, addToCart });
  }
}
