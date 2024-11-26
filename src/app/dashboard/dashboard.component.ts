import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';
import { Category, Item, Cart } from '../interfaces';
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
  cartItems: Cart[] = [];
  nameSearch: string = '';
  priceSearch: number | null = null;
  categories: Category[] = [];
  cartCount: number = 0;
  activeCategory: string = '';

  constructor(
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.getItems();
    this.getCategories();
    this.getCartItems(); // Fetch cart items
    // this.cartService.cartCount$.subscribe((count) => {
    //   this.cartCount = count;
    // });
    this.route.queryParams.subscribe((params) => {
      this.activeCategory = params['category'] || '';
      this.filterItems();
    });
  }

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

  getCartItems(): void {
    this.cartService.getCartItems().subscribe((cartItems) => {
      this.cartItems = cartItems; // Save cart items
      this.cartCount = this.cartItems.length; // Calculate the count from cartItems
    });
  }


  itemInCart(item: Item): boolean {
    return this.cartItems.some((cartItem) => cartItem.itemId === item.id);
  }

  toggleCartItem(event: { item: Item; addToCart: boolean }): void {
    const { item, addToCart } = event;
  
    if (addToCart) {
      this.cartService.addItemToCart(item).subscribe(() => {
        this.getCartItems(); // Refresh cart items after adding
      });
    } else {
      const cartItem = this.cartItems.find((cartItem) => cartItem.itemId === item.id);
      if (cartItem) {
        this.cartService.removeItemFromCart(cartItem.id).subscribe(() => {
          this.getCartItems(); // Refresh cart items after removing
        });
      }
    }
  }

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

  onEditItem(item: Item): void {
    this.router.navigate(['/item/edit', item.id]);
  }

  onDeleteItem(itemId: number): void {
    this.itemService.deleteItem(itemId).subscribe(() => {
      // Refresh items after deletion
      this.getItems();
      
      // Remove the item from the cart if it exists
      const cartItem = this.cartItems.find((cartItem) => cartItem.itemId === itemId);
      if (cartItem) {
        this.cartService.removeItemFromCart(cartItem.id).subscribe(() => {
          this.getCartItems(); // Refresh cart items and update cartCount
        });
      }
    });
  }
  

  goToCart(): void {
    this.router.navigate(['/cart']);
  }
}
