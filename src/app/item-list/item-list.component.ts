import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Item } from '../interfaces';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
})
export class ItemListComponent {
  @Input() items: Item[] = [];
  @Output() editItem = new EventEmitter<Item>();
  @Output() deleteItem = new EventEmitter<number>();

  onEditItem(item: Item) {
    this.editItem.emit(item);
  }

  onDeleteItem(itemId: number) {
    this.deleteItem.emit(itemId);
  }
}
