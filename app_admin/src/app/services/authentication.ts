import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BROWSER_STORAGE } from '../storage';
import { TripData } from './trip-data';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';

@Injectable({
  providedIn: 'root'
})
export class Authentication {
  private storage = inject(BROWSER_STORAGE);
  private tripData = inject(TripData);
  private tokenKey = 'travlr-token';

  getToken(): string {
    return this.storage.getItem(this.tokenKey) ?? '';
  }

  saveToken(token: string): void {
    this.storage.setItem(this.tokenKey, token);
  }

  logout(): void {
    this.storage.removeItem(this.tokenKey);
  }

  // Logged in only when a token exists and has not expired
  isLoggedIn(): boolean {
    const payload = this.decode(this.getToken());
    return !!payload && payload.exp > Date.now() / 1000;
  }

  getCurrentUser(): User | null {
    if (!this.isLoggedIn()) {
      return null;
    }
    const { email, name } = this.decode(this.getToken());
    return { email, name };
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.tripData.login(email, password).pipe(
      tap((res) => this.saveToken(res.token))
    );
  }

  register(user: User, password: string): Observable<AuthResponse> {
    return this.tripData.register(user, password).pipe(
      tap((res) => this.saveToken(res.token))
    );
  }

  // Read the JWT payload (the middle, base64url-encoded part)
  private decode(token: string): any {
    if (!token) {
      return null;
    }
    try {
      const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(part));
    } catch {
      return null;
    }
  }
}
