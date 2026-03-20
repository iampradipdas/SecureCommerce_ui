import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/order`;

  constructor(private http: HttpClient) {}

  checkout(checkoutData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/checkout`, checkoutData);
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getOrderById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getVendorOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/vendor`);
  }

  updateOrderStatus(id: string, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/status`, `"${status}"`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
