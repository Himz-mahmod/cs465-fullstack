import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Authentication } from '../services/authentication';
import { History } from '../services/history';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(Authentication);
  private history = inject(History);

  formError = signal('');

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit(): void {
    this.formError.set('');
    if (this.loginForm.invalid) {
      this.formError.set('Email and password are required.');
      return;
    }
    const { email, password } = this.loginForm.getRawValue();
    this.auth.login(email, password).subscribe({
      next: () => this.router.navigateByUrl(this.history.getLastNonLoginUrl()),
      error: () => this.formError.set('Incorrect email or password.')
    });
  }
}
