import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from '../item.service';
import { CartService } from '../cart.service';
import { Item, Category } from '../interfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  items: Item[] = [];
  categories: Category[] = [];
  displayedItems: Item[] = [];
  selectedCategory: string | null = null;
  nameSearch: string = '';
  priceSearch: number | null = null;
  cartCount = 0;

  constructor(
    private itemService: ItemService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCategories();
    this.subscribeToCartCount();

    // Listen for query parameter changes
    this.route.queryParams.subscribe((params) => {
      this.selectedCategory = params['category'] || null;
      this.fetchItems();
    });
  }

  getCategories(): void {
    this.itemService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  fetchItems(): void {
    if (this.selectedCategory) {
      this.itemService.getItemsByCategory(this.selectedCategory).subscribe((items) => {
        this.items = items;
        this.filterItems();
      });
    } else {
      this.itemService.getItems().subscribe((items) => {
        this.items = items;
        this.filterItems();
      });
    }
  }

  filterItems(): void {
    this.displayedItems = this.items.filter((item) => {
      const matchesName = this.nameSearch
        ? item.name.toLowerCase().includes(this.nameSearch.toLowerCase())
        : true;
      const matchesPrice = this.priceSearch !== null ? item.price === this.priceSearch : true;
      return matchesName && matchesPrice;
    });
  }

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

  deleteItem(itemId: number): void {
    this.itemService.deleteItem(itemId).subscribe(() => {
      this.items = this.items.filter((item) => item.id !== itemId);
      this.filterItems();
      this.cartService.handleItemDelete(itemId); // Remove the item from the cart
    });
  }

  toggleCartItemChecked(item: Item, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    isChecked
      ? this.cartService.addItemToCart(item)
      : this.cartService.removeItemFromCart(item.id);
  }

  isItemInCart(itemId: number): boolean {
    return this.cartService.isItemInCart(itemId);
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
