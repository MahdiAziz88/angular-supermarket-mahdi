import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';
import { Category, Item } from '../interfaces';
import { Router, ActivatedRoute } from '@angular/router';
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
  activeCategory: string = '';
  cartItemsMap: { [key: number]: boolean } = {}; // Map of item IDs to cart status

  constructor(
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.getItems();
    this.getCategories();
    this.loadCartItems(); // Load cart items once
    // Subscribe to cart count updates
    this.cartService.cartCount$.subscribe((count) => {
      this.cartCount = count; // Update the cart count in real-time
    });
    this.route.queryParams.subscribe(params => {
      this.activeCategory = params['category'] || '';
      this.filterItems();
    });
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe((cartItems) => {
      this.cartItemsMap = cartItems.reduce((map: { [key: number]: boolean }, cartItem) => {
        map[cartItem.itemId] = true;
        return map;
      }, {});
    });
  }
  

  // Fetch items from the ItemService
  getItems(): void {
    this.itemService.getItems().subscribe((items) => {
      // Load cart items to update the `isInCart` state for each item
      this.cartService.getCartItems().subscribe((cartItems) => {
        const cartItemIds = cartItems.map((cartItem) => cartItem.itemId);
  
        // Add `isInCart` property to each item
        this.items = items.map((item) => ({
          ...item,
          isInCart: cartItemIds.includes(item.id), // Set initial cart state
        }));
  
        this.filterItems(); // Apply any filters
      });
    });
  }
  

  getCategories(): void {
    this.itemService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  // Filter items based on search criteria and active category
  filterItems(): void {
    this.filteredItems = this.items.filter((item) => {
      const matchesName =
        this.nameSearch === '' ||
        item.name.toLowerCase().includes(this.nameSearch.toLowerCase());
      const matchesPrice =
        this.priceSearch === null || item.price <= this.priceSearch;
      const matchesCategory =
        this.activeCategory === '' || item.category === this.activeCategory;
      return matchesName && matchesPrice && matchesCategory;
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
      // Remove the item from the items array
      this.items = this.items.filter((item) => item.id !== itemId);
  
      // Optionally update cart state
      this.cartService.removeItemFromCart(itemId).subscribe(() => {
        // Update cart state if needed
      });
  
      this.filterItems(); // Reapply filters
    });
  }
  
  

  goToCart(): void {
    this.router.navigate(['/cart']);
  }
}