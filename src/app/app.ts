import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { StorageService } from './services/storage.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    public themeService: ThemeService
  ) {}

  isLoggedIn() {
    return this.storageService.isLoggedIn();
  }

  logout() {
    this.storageService.clean();
    this.authService.updateAuthStatus(false);
    this.router.navigate(['/login']);
  }

  username() {
    return this.storageService.getUser()?.name || '';
  }

  isVendor() {
    const user = this.storageService.getUser();
    return user?.roles?.includes('Vendor') || false;
  }
}
