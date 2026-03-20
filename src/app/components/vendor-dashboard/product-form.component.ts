import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService, Category } from '../../services/category.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  isEditMode = false;
  productId: string | null = null;
  categories: Category[] = [];
  product = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: '',
    imageUrl: ''
  };
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;

    this.loadCategories();

    if (this.isEditMode && this.productId) {
      this.loadProduct(this.productId);
    }
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: data => {
        this.categories = data;
        if (this.categories.length > 0 && !this.product.categoryId) {
          this.product.categoryId = this.categories[0].id;
        }
      }
    });
  }

  loadProduct(id: string): void {
    this.productService.getProductById(id).subscribe({
      next: data => {
        this.product = {
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          categoryId: data.categoryId,
          imageUrl: data.imageUrl
        };
      },
      error: err => {
        this.errorMessage = 'Could not load product data.';
      }
    });
  }

  onSubmit(): void {
    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, this.product).subscribe({
        next: () => {
          alert('Product updated successfully!');
          this.router.navigate(['/vendor/dashboard']);
        },
        error: err => {
          this.errorMessage = err.error?.message || 'Error updating product.';
        }
      });
    } else {
      this.productService.createProduct(this.product).subscribe({
        next: () => {
          alert('Product created successfully!');
          this.router.navigate(['/vendor/dashboard']);
        },
        error: err => {
          this.errorMessage = err.error?.message || 'Error creating product.';
        }
      });
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.productService.uploadImage(file).subscribe({
        next: (response) => {
          this.product.imageUrl = response.imageUrl;
          alert('Image uploaded successfully!');
        },
        error: (err) => {
          alert('Error uploading image.');
        }
      });
    }
  }
}
