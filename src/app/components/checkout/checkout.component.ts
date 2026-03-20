import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cart: any = null;
  shippingAddress = {
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
    country: ''
  };
  isProcessing = false;
  errorMessage = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cartService.getCart().subscribe({
      next: data => {
        this.cart = data;
        if (!this.cart || !this.cart.items || this.cart.items.length === 0) {
          this.router.navigate(['/cart']);
        }
      },
      error: () => this.router.navigate(['/cart'])
    });
  }

  onCheckout(): void {
    if (!this.shippingAddress.fullName || !this.shippingAddress.address) {
      this.errorMessage = 'Please provide complete shipping information.';
      return;
    }

    this.isProcessing = true;
    const checkoutData = {
      shippingFullName: this.shippingAddress.fullName,
      shippingAddress: this.shippingAddress.address,
      shippingCity: this.shippingAddress.city,
      shippingZipCode: this.shippingAddress.zipCode,
      shippingCountry: this.shippingAddress.country,
      paymentMethod: 'Credit Card' // Simulated
    };

    this.orderService.checkout(checkoutData).subscribe({
      next: (order) => {
        this.isProcessing = false;
        alert('Order placed successfully!');
        this.router.navigate(['/orders']);
      },
      error: err => {
        this.isProcessing = false;
        this.errorMessage = err.error?.message || 'Checkout failed. Please try again.';
      }
    });
  }
}
