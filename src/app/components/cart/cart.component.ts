import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: any = null;
  errorMessage = '';

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: data => {
        this.cart = data;
      },
      error: err => {
        this.errorMessage = 'Could not load your cart.';
        console.error(err);
      }
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) return;
    this.cartService.updateItem(productId, quantity).subscribe({
      next: data => {
        this.cart = data;
      },
      error: err => {
        this.errorMessage = err.error.message || 'Could not update quantity.';
      }
    });
  }

  removeItem(productId: string): void {
    this.cartService.removeItem(productId).subscribe({
      next: data => {
        this.cart = data;
      },
      error: err => {
        this.errorMessage = 'Could not remove item.';
      }
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => {
        this.cart = { items: [], totalAmount: 0 };
      },
      error: err => {
        this.errorMessage = 'Could not clear cart.';
      }
    });
  }
}
