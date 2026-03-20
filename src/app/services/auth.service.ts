import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

const AUTH_API = `${environment.apiUrl}/auth/`;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStatusSubject = new BehaviorSubject<boolean>(false);
  authStatus$ = this.authStatusSubject.asObservable();

  constructor(private http: HttpClient) {}

  updateAuthStatus(isLoggedIn: boolean): void {
    this.authStatusSubject.next(isLoggedIn);
  }

  login(model: any): Observable<any> {
    return this.http.post(
      AUTH_API + 'login',
      model,
      httpOptions
    );
  }

  register(model: any): Observable<any> {
    return this.http.post(
      AUTH_API + 'register',
      model,
      httpOptions
    );
  }

  refreshToken(token: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'refresh',
      { refreshToken: token },
      httpOptions
    );
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
