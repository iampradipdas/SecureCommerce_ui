import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;

  constructor(private http: HttpClient) {}

  getCart(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  addItem(productId: string, quantity: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/items`, { productId, quantity });
  }

  updateItem(productId: string, quantity: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/items/${productId}`, { quantity });
  }

  removeItem(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/items/${productId}`);
  }

  clearCart(): Observable<any> {
    return this.http.delete<any>(this.apiUrl);
  }
}
