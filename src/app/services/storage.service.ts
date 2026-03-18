import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const REFRESH_TOKEN_KEY = 'auth-refresh-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() {}

  clean(): void {
    window.localStorage.clear();
  }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  public saveRefreshToken(token: string): void {
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }

  public getRefreshToken(): string | null {
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    if (user) {
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user && user !== 'undefined') {
      try {
        return JSON.parse(user);
      } catch (e) {
        console.error('Error parsing user from storage', e);
        return null;
      }
    }

    return null;
  }

  public isLoggedIn(): boolean {
    const token = window.localStorage.getItem(TOKEN_KEY);
    return !!token;
  }
}
