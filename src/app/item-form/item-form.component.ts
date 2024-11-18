import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from '../item.service';
import { Item, Category } from '../interfaces';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent implements OnInit {
  itemForm: FormGroup;
  categories: Category[] = [];
  isEditMode: boolean = false;
  itemId: number | null = null;

    // Getters for easy access in template
    get name(): AbstractControl | null {
      return this.itemForm.get('name');
    }
  
    get price(): AbstractControl | null {
      return this.itemForm.get('price');
    }
  
    get category(): AbstractControl | null {
      return this.itemForm.get('category');
    }

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.itemService.getCategories().subscribe(categories => this.categories = categories);

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.itemId = +id;
        this.loadItem(this.itemId);
      }
    });
  }

  loadItem(id: number): void {
    this.itemService.getItems().subscribe(items => {
      const item = items.find(i => i.id === id);
      if (item) this.itemForm.patchValue(item);
    });
  }

  onSave(): void {
    if (this.itemForm.invalid) return;

    const item: Item = { ...this.itemForm.value, id: this.itemId ? this.itemId : 0 };

    if (this.isEditMode) {
      this.itemService.updateItem(item).subscribe(() => this.router.navigate(['/all-items']));
    } else {
      this.itemService.addItem(item).subscribe(() => this.router.navigate(['/all-items']));
    }
  }

  onCancel(): void {
    this.router.navigate(['/all-items']);
  }


}
