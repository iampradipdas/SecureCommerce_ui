import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';

import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  errorMessage = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: data => {
        this.products = data;
      },
      error: err => {
        this.errorMessage = 'Could not load products. Please try again later.';
        console.error(err);
      }
    });
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
