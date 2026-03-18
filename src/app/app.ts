import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from './services/storage.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = signal('SecureCommerce');
  isLoggedIn = signal(false);
  username = signal<string | null>(null);

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.authStatus$.subscribe(() => {
      this.updateAuthState();
    });

    // Initial check
    const loggedIn = this.storageService.isLoggedIn();
    this.authService.updateAuthStatus(loggedIn);
  }

  updateAuthState(): void {
    const loggedIn = this.storageService.isLoggedIn();
    this.isLoggedIn.set(loggedIn);
    if (loggedIn) {
      const user = this.storageService.getUser();
      this.username.set(user?.name || 'User');
    }
  }

  logout(): void {
    this.storageService.clean();
    this.authService.updateAuthStatus(false);
    this.username.set(null);
    this.router.navigate(['/login']);
  }
}
