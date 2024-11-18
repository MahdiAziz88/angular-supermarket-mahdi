import { Component, Input, OnInit } from '@angular/core';
import { Category } from '../interfaces';

@Component({
  selector: 'app-category-tabs',
  templateUrl: './category-tabs.component.html',
  styleUrls: ['./category-tabs.component.css'],
})
export class CategoryTabsComponent implements OnInit {
  @Input() categories: Category[] = [];

  constructor() {}

  ngOnInit(): void {}
}
