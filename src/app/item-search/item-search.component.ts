import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.css']
})
export class ItemSearchComponent {
  nameSearch: string = '';
  priceSearch: number | null = null;

  @Output() filterCriteria = new EventEmitter<{ name: string; price: number | null }>();
  @Output() clearFiltersEvent = new EventEmitter<void>(); // Emit clear filters event

  // Emit the search criteria when filter button is clicked
  onFilter() {
    this.filterCriteria.emit({ name: this.nameSearch, price: this.priceSearch });
  }

  // Clear the input fields and emit the clear filters event
  clearFilters() {
    this.nameSearch = '';
    this.priceSearch = null;
    this.clearFiltersEvent.emit(); // Notify ItemComponent to reset filters
  }
}
