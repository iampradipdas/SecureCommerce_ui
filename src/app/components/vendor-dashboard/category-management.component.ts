import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../services/category.service';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css']
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = [];
  newCategory: any = { name: '', description: '' };
  editingCategory: Category | null = null;
  loading = false;
  message = '';
  isError = false;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.editingCategory) {
      this.updateCategory();
    } else {
      this.createCategory();
    }
  }

  createCategory(): void {
    this.categoryService.createCategory(this.newCategory).subscribe({
      next: (res) => {
        this.message = 'Category created successfully!';
        this.isError = false;
        this.newCategory = { name: '', description: '' };
        this.loadCategories();
      },
      error: (err) => {
        this.message = 'Failed to create category.';
        this.isError = true;
      }
    });
  }

  updateCategory(): void {
    if (!this.editingCategory) return;
    this.categoryService.updateCategory(this.editingCategory.id, this.newCategory).subscribe({
      next: (res) => {
        this.message = 'Category updated successfully!';
        this.isError = false;
        this.editingCategory = null;
        this.newCategory = { name: '', description: '' };
        this.loadCategories();
      },
      error: (err) => {
        this.message = 'Failed to update category.';
        this.isError = true;
      }
    });
  }

  editCategory(category: Category): void {
    this.editingCategory = category;
    this.newCategory = { name: category.name, description: category.description };
  }

  cancelEdit(): void {
    this.editingCategory = null;
    this.newCategory = { name: '', description: '' };
  }

  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: (err) => {
          this.message = 'Failed to delete category.';
          this.isError = true;
        }
      });
    }
  }
}
