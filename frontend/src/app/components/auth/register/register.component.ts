import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
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
    MatCardModule,
    MatCheckboxModule,
    MatIconModule
  ],
  template: `
    <div class="min-h-screen flex">
      <!-- Left side with registration form -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div class="w-full max-w-md">
          <div class="text-center mb-8">
            <img src="assets/cognizant-logo.png" alt="Cognizant" class="h-12 mx-auto mb-6">
            <h1 class="text-3xl font-bold mb-2 text-[#0033A0]">Create Account</h1>
            <p class="text-gray-600">Join our community of developers</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Full Name</mat-label>
              <input matInput formControlName="fullName" required>
              @if (registerForm.get('fullName')?.touched && registerForm.get('fullName')?.invalid) {
                <mat-error>Full name is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required>
              @if (registerForm.get('email')?.touched && registerForm.get('email')?.invalid) {
                <mat-error>
                  @if (registerForm.get('email')?.errors?.['required']) {
                    Email is required
                  } @else if (registerForm.get('email')?.errors?.['email']) {
                    Please enter a valid email address
                  }
                </mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" required>
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              @if (registerForm.get('password')?.touched && registerForm.get('password')?.invalid) {
                <mat-error>
                  Password must be at least 8 characters long and contain at least one uppercase letter,
                  one lowercase letter, one number, and one special character
                </mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Confirm Password</mat-label>
              <input matInput [type]="hideConfirmPassword ? 'password' : 'text'" formControlName="confirmPassword" required>
              <button mat-icon-button matSuffix (click)="hideConfirmPassword = !hideConfirmPassword" type="button">
                <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              @if (registerForm.get('confirmPassword')?.touched && registerForm.get('confirmPassword')?.invalid) {
                <mat-error>
                  @if (registerForm.get('confirmPassword')?.errors?.['required']) {
                    Confirm password is required
                  } @else if (registerForm.get('confirmPassword')?.errors?.['passwordMismatch']) {
                    Passwords do not match
                  }
                </mat-error>
              }
            </mat-form-field>

            <div class="flex items-center space-x-2">
              <mat-checkbox formControlName="termsAccepted" color="primary" required>
                I agree to the
              </mat-checkbox>
              <a href="/terms" class="text-[#0033A0] hover:text-[#002277]">Terms of Service</a>
              <span>and</span>
              <a href="/privacy" class="text-[#0033A0] hover:text-[#002277]">Privacy Policy</a>
            </div>

            <button mat-raised-button color="primary" 
                    class="w-full py-3 text-lg bg-[#0033A0] hover:bg-[#002277]" 
                    type="submit" 
                    [disabled]="registerForm.invalid || isLoading">
              {{ isLoading ? 'Creating account...' : 'Sign up' }}
            </button>

            <div class="text-center">
              <div class="my-4 flex items-center justify-center">
                <div class="border-t border-gray-300 w-full"></div>
                <span class="bg-white px-4 text-gray-500">or</span>
                <div class="border-t border-gray-300 w-full"></div>
              </div>

              <div class="space-y-3">
                <button mat-stroked-button class="w-full py-2 flex justify-center items-center space-x-2">
                  <img src="assets/google.svg" alt="Google" class="w-6 h-6">
                  <span>Continue with Google</span>
                </button>
                <div class="grid grid-cols-2 gap-3">
                  <button mat-stroked-button class="w-full py-2 flex justify-center items-center space-x-2">
                    <img src="assets/linkedin.svg" alt="LinkedIn" class="w-6 h-6">
                    <span>LinkedIn</span>
                  </button>
                  <button mat-stroked-button class="w-full py-2 flex justify-center items-center space-x-2">
                    <img src="assets/github.svg" alt="GitHub" class="w-6 h-6">
                    <span>GitHub</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="text-center mt-6">
              <p class="text-gray-600">
                Already have an account?
                <a routerLink="/login" class="text-[#0033A0] hover:text-[#002277] ml-1">Log in</a>
              </p>
            </div>
          </form>
        </div>
      </div>

      <!-- Right side with modern gradient background -->
      <div class="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#000033] via-[#001B5E] to-[#0033A0]">
        <div class="absolute inset-0 bg-[url('/assets/pattern.png')] opacity-10"></div>
        <div class="absolute inset-0 flex flex-col justify-center px-12 z-10">
          <div class="text-white max-w-xl">
            <h1 class="text-7xl font-bold mb-6 tracking-tight">Vibe Coding Hub</h1>
            <p class="text-[#4FC3F7] text-2xl leading-relaxed mb-8 font-light">
              A comprehensive platform for registration, learning, project submission, 
              and evaluation — purpose-built for the Vibe Coding Week.
            </p>
            <p class="text-[#81D4FA] text-xl leading-relaxed font-light">
              Developed using cutting-edge, AI-powered tools to showcase the transformative 
              potential of modern coding assistants.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
    .mat-mdc-form-field {
      width: 100%;
    }
    .mat-mdc-raised-button {
      height: 48px;
    }
    /* Override Material theme colors */
    ::ng-deep {
      .mat-mdc-raised-button.mat-primary {
        background-color: #0033A0 !important;
      }
      .mat-mdc-raised-button.mat-primary:hover {
        background-color: #002277 !important;
      }
      .mat-mdc-form-field-outline {
        color: #0033A0 !important;
      }
      .mat-mdc-checkbox .mdc-checkbox .mdc-checkbox__native-control:enabled:checked ~ .mdc-checkbox__background {
        background-color: #0033A0 !important;
        border-color: #0033A0 !important;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required],
      termsAccepted: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const { fullName, email, password } = this.registerForm.value;

      this.authService.register(fullName, email, password).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.snackBar.open('Registration successful! Please log in.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.snackBar.open(error.message || 'Registration failed. Please try again.', 'Close', {
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
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
    }
  }
} 