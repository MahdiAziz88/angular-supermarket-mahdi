import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Category } from '../interfaces';

@Component({
  selector: 'app-category-tabs',
  templateUrl: './category-tabs.component.html',
  styleUrls: ['./category-tabs.component.css'],
})
export class CategoryTabsComponent implements OnInit {
  @Input() categories: Category[] = [];
  @Output() categorySelected = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  onCategorySelected(category: string): void {
    this.categorySelected.emit(category);
  }
}
