import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-vendor-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendor-orders.component.html',
  styleUrls: ['./vendor-orders.component.css']
})
export class VendorOrdersComponent implements OnInit {
  orders: any[] = [];
  isLoading = true;
  errorMessage = '';
  statuses = ['Placed', 'Shipped', 'Delivered', 'Cancelled'];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getVendorOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load orders.';
        this.isLoading = false;
      }
    });
  }

  updateStatus(orderId: string, event: any): void {
    const status = event.target.value;
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: () => {
        alert('Status updated successfully!');
      },
      error: () => {
        alert('Failed to update status.');
        this.loadOrders(); // Revert on failure
      }
    });
  }
}
