import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';
import { Category, Item } from '../interfaces';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  items: Item[] = [];
  filteredItems: Item[] = [];
  displayedItems: Item[] = [];
  nameSearch: string = '';
  priceSearch: number | null = null;
  categories: Category[] = [];
  cartCount: number = 0;

  constructor(
    private itemService: ItemService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.getItems();
    this.getCategories();
    this.getCartCount();
  }

  // Fetch items from the ItemService
  getItems(): void {
    this.itemService.getItems().subscribe((items) => {
      this.items = items;
      this.filterItems();
    });
  }

  getCategories(): void {
    this.itemService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  getCartCount(): void {
    this.cartService.getCartItems().subscribe((cartItems) => {
      this.cartCount = cartItems.length;
    });
  }

  // Filter items based on search criteria
  filterItems(): void {
    this.filteredItems = this.items.filter((item) => {
      const matchesName =
        this.nameSearch === '' ||
        item.name.toLowerCase().includes(this.nameSearch.toLowerCase());
      const matchesPrice =
        this.priceSearch === null || item.price <= this.priceSearch;
      return matchesName && matchesPrice;
    });
    this.displayedItems = this.filteredItems;
  }

  /**
   * Applies a filter to the items based on the given criteria.
   *
   * @param criteria - An object containing the filter criteria.
   * @param criteria.name - The name to filter by.
   * @param criteria.price - The price to filter by, or null if no price filter is applied.
   */
  applyFilter(criteria: { name: string; price: number | null }): void {
    this.nameSearch = criteria.name;
    this.priceSearch = criteria.price;
    this.filterItems();
  }

  // Clear all filters
  clearFilters(): void {
    this.nameSearch = '';
    this.priceSearch = null;
    this.filterItems();
  }

  // Navigate to the add item form
  navigateToAddForm(): void {
    this.router.navigate(['/item/new']);
  }

  // Handle edit item event
  onEditItem(item: Item): void {
    this.router.navigate(['/item/edit', item.id]);
  }

  // Handle delete item event
  onDeleteItem(itemId: number): void {
    this.itemService.deleteItem(itemId).subscribe(() => {
      this.getItems(); // Refresh the items after deletion
      this.cartService.deleteCartItem(itemId).subscribe(() => {
        this.cartService.getCartItems().subscribe((cartItems) => {
          this.cartCount = cartItems.length;
        });
      });
    });
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }
}