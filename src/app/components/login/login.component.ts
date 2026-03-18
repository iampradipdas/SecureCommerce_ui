import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {
    email: '',
    password: ''
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      // Redirect to products if already logged in (to be implemented)
      // this.router.navigate(['/products']);
    }
  }

  onSubmit(): void {
    const { email, password } = this.form;

    this.authService.login({ email, password }).subscribe({
      next: data => {
        if (data.success) {
          this.storageService.saveToken(data.token);
          this.storageService.saveRefreshToken(data.refreshToken);
          this.storageService.saveUser(data.user);
          this.authService.updateAuthStatus(true);

          this.isLoginFailed = false;
          this.isLoggedIn = true;
          
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = data.message || 'Login failed.';
          this.isLoginFailed = true;
        }
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Login failed. Please check your credentials.';
        this.isLoginFailed = true;
      }
    });
  }
}
