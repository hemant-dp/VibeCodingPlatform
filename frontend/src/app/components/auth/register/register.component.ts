import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div class="w-full max-w-md space-y-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900">Create your account</h2>
          <p class="mt-2 text-sm text-gray-600">
            Or
            <a routerLink="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
              sign in to your account
            </a>
          </p>
        </div>

        <mat-card>
          <mat-card-content>
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Username</mat-label>
                <input matInput formControlName="username" required>
                @if (registerForm.get('username')?.touched && registerForm.get('username')?.invalid) {
                  <mat-error>
                    Username is required and must be at least 3 characters
                  </mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" type="email" required>
                @if (registerForm.get('email')?.touched && registerForm.get('email')?.invalid) {
                  <mat-error>
                    Please enter a valid email address
                  </mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Password</mat-label>
                <input matInput formControlName="password" type="password" required>
                @if (registerForm.get('password')?.touched && registerForm.get('password')?.invalid) {
                  <mat-error>
                    Password must be at least 6 characters
                  </mat-error>
                }
              </mat-form-field>

              <div class="flex justify-end">
                <button mat-raised-button color="primary" type="submit" [disabled]="registerForm.invalid || isLoading">
                  {{ isLoading ? 'Registering...' : 'Register' }}
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const { username, email, password } = this.registerForm.value;

      console.log('Attempting to register with:', { username, email });

      this.authService.register(username, email, password).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.snackBar.open(response.message, 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.snackBar.open(error.message || 'Registration failed', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
} 