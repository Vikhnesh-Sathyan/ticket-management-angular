import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }

    const { name, email, password } = this.registerForm.value;
    const success = this.authService.register(email, password, name);

    if (success) {
      this.successMessage = 'Registration successful! Redirecting to login...';
      this.errorMessage = '';
      // Clear form
      this.registerForm.reset();
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsUntouched();
      });
      
      // Redirect to login page after registration with success parameter
      setTimeout(() => {
        this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
      }, 1500);
    } else {
      this.errorMessage = 'Email already exists. Please use a different email or login.';
      this.successMessage = '';
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}

