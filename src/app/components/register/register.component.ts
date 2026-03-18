import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: any = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void { }

  onSubmit(): void {
    const { username, email, password } = this.form;

    this.authService.register({ name: username, email, password }).subscribe({
      next: data => {
        if (data.success) {
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else {
          this.errorMessage = data.message || 'Registration failed.';
          this.isSignUpFailed = true;
        }
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Registration failed. Please check your details.';
        this.isSignUpFailed = true;
      }
    });
  }
}
