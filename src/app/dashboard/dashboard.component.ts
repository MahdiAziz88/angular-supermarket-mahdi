import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';
import { CartService } from '../cart.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Item, Category } from '../interfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  items: Item[] = [];
  displayedItems: Item[] = [];
  categories: Category[] = [];
  nameSearch: string = '';
  selectedCategory: string = '';
  priceSearch: number | null = null;
  cartCount: number = 0;

  constructor(
    private itemService: ItemService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getItems();
    this.getCategories();
    this.subscribeToCartCount();
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['category'] || '';
      this.filterItems();
    });
  }

  getCategories(): void {
    this.itemService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  getItems(): void {
    this.itemService.getItems().subscribe((items) => {
      this.items = items;
      this.filterItems();
    });
  }

  filterItems(): void {
    // Filter the items based on the search criteria and update the displayedItems array
    this.displayedItems = this.items.filter((item) => {
      
      // Check if the item's name matches the nameSearch criteria (case-insensitive)
      const matchesName = this.nameSearch
        ? item.name.toLowerCase().includes(this.nameSearch.toLowerCase())
        : true; // If no nameSearch is provided, consider it a match
      
      // Check if the item's category matches the selectedCategory
      const matchesCategory = this.selectedCategory
        ? item.category === this.selectedCategory
        : true; // If no selectedCategory is provided, consider it a match
      
      // Check if the item's price matches the priceSearch
      const matchesPrice =
        this.priceSearch !== null ? item.price === this.priceSearch : true; // If no priceSearch is provided, consider it a match
      
      // Return true if the item matches all the criteria
      return matchesName && matchesCategory && matchesPrice;
    });
  }

  /**
   * Applies a filter to the items based on the given criteria.
   * 
   * @param criteria - An object containing the filter criteria.
   * @param criteria.name - The name to filter by.
   * @param criteria.price - The price to filter by, or null if no price filter is applied.
   * 
   * This method sets the name and price search criteria and then calls the filterItems method
   * to apply the filter to the items.
   */
  applyFilter(criteria: { name: string; price: number | null }): void {
    this.nameSearch = criteria.name;
    this.priceSearch = criteria.price;
    this.filterItems();
  }

  clearFilters(): void {
    this.nameSearch = '';
    this.priceSearch = null;
    this.filterItems();
  }

  navigateToAddForm(): void {
    this.router.navigate(['/item/new']);
  }

  navigateToEditForm(item: Item): void {
    this.router.navigate(['/item/edit', item.id]);
  }

  /**
   * Deletes an item by its ID from the item list and the cart.
   * 
   * This method performs the following steps:
   * 1. Calls the `deleteItem` method of `itemService` to delete the item from the backend.
   * 2. Filters the `items` array to remove the item with the specified ID.
   * 3. Calls `filterItems` to update the filtered items list.
   * 4. Calls the `removeItemFromCart` method of `cartService` to remove the item from the cart.
   *.filter Removes an item from the this.items array by excluding the item with the matching id.
   * @param itemId - The ID of the item to be deleted.
   */
  deleteItem(itemId: number): void {
    this.itemService.deleteItem(itemId).subscribe(() => {
      this.items = this.items.filter((item) => item.id !== itemId);
      this.filterItems();
      this.cartService.removeItemFromCart(itemId).subscribe(() => {
        // Optionally handle any additional logic after removing the item from the cart
      });
    });
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  private subscribeToCartCount(): void {
    this.cartService.cartCount$.subscribe((count) => {
      this.cartCount = count;
    });
  }
}
