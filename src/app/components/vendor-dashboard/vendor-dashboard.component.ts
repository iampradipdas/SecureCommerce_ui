import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.css']
})
export class VendorDashboardComponent implements OnInit {
  products: any[] = [];
  errorMessage = '';

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadMyProducts();
  }

  loadMyProducts(): void {
    this.productService.getMyProducts().subscribe({
      next: data => {
        this.products = data;
      },
      error: err => {
        this.errorMessage = 'Could not load your products.';
        console.error(err);
      }
    });
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
          alert('Product deleted successfully.');
        },
        error: err => {
          alert('Error deleting product.');
        }
      });
    }
  }
}
