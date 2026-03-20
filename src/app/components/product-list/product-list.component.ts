import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { CategoryService, Category } from '../../services/category.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  categories: Category[] = [];
  selectedCategoryId: string | null = null;
  searchTerm = '';
  errorMessage = '';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: data => {
        this.categories = data;
      },
      error: err => {
        console.error('Could not load categories', err);
      }
    });
  }

  loadProducts(categoryId?: string, searchTerm?: string): void {
    this.productService.getProducts(categoryId, searchTerm).subscribe({
      next: data => {
        this.products = data;
      },
      error: err => {
        this.errorMessage = 'Could not load products. Please try again later.';
        console.error(err);
      }
    });
  }

  onCategorySelect(categoryId: string | null): void {
    this.selectedCategoryId = categoryId;
    this.loadProducts(categoryId || undefined, this.searchTerm || undefined);
  }

  onSearch(): void {
    this.loadProducts(this.selectedCategoryId || undefined, this.searchTerm || undefined);
  }

  addToCart(product: any): void {
    this.cartService.addItem(product.id, 1).subscribe({
      next: () => {
        alert(`${product.name} added to cart!`);
      },
      error: err => {
        alert(err.error.message || 'Could not add product to cart.');
      }
    });
  }
}
