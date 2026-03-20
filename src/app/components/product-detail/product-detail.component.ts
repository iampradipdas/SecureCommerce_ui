import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ReviewService, Review } from '../../services/review.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: any;
  reviews: Review[] = [];
  errorMessage = '';
  newReview = {
    rating: 5,
    comment: ''
  };
  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private reviewService: ReviewService,
    private cartService: CartService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
      this.loadReviews(id);
    }
    this.isLoggedIn = !!this.authService.getCurrentUser();
  }

  loadProduct(id: string): void {
    this.productService.getProductById(id).subscribe({
      next: data => {
        this.product = data;
      },
      error: err => {
        this.errorMessage = 'Product not found.';
      }
    });
  }

  loadReviews(productId: string): void {
    this.reviewService.getReviews(productId).subscribe({
      next: data => {
        this.reviews = data;
      }
    });
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addItem(this.product.id, 1).subscribe({
        next: () => alert('Added to cart!'),
        error: () => alert('Error adding to cart.')
      });
    }
  }

  submitReview(): void {
    if (!this.product) return;

    this.reviewService.createReview({
      productId: this.product.id,
      rating: this.newReview.rating,
      comment: this.newReview.comment
    }).subscribe({
      next: (review) => {
        this.reviews.unshift(review);
        this.newReview = { rating: 5, comment: '' };
        alert('Review submitted!');
      },
      error: (err) => {
        alert(err.error?.message || 'Error submitting review.');
      }
    });
  }
}
