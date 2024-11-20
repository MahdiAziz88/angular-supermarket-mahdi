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
    this.displayedItems = this.items.filter((item) => {
      const matchesName = this.nameSearch
        ? item.name.toLowerCase().includes(this.nameSearch.toLowerCase())
        : true;
      const matchesCategory = this.selectedCategory
        ? item.category === this.selectedCategory
        : true;
      const matchesPrice =
        this.priceSearch !== null ? item.price === this.priceSearch : true;
      return matchesName && matchesCategory && matchesPrice;
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
