import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryTabsComponent } from './category-tabs.component';

describe('CategoryTabsComponent', () => {
  let component: CategoryTabsComponent;
  let fixture: ComponentFixture<CategoryTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryTabsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
