import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Item } from '../interfaces';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
})
export class ItemComponent {
  @Input() item!: Item;
  @Input() isInCart: boolean = false;
  @Output() edit = new EventEmitter<Item>();
  @Output() delete = new EventEmitter<number>();
  @Output() cartToggle = new EventEmitter<boolean>();

  onEdit(): void {
    this.edit.emit(this.item);
  }

  onDelete(): void {
    this.delete.emit(this.item.id);
  }

  toggleCart(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.cartToggle.emit(isChecked);
  }
}
