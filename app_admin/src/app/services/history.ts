import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

// Remembers the pages the admin visits so login can send them back
// to the last real page instead of always going to the home page.
@Injectable({
  providedIn: 'root'
})
export class History {
  private router = inject(Router);
  private history: string[] = [];
  private authPaths = ['/login', '/register'];

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.history.push(e.urlAfterRedirects));
  }

  getHistory(): string[] {
    return [...this.history];
  }

  // Last visited page that is not /login or /register, or '/' if none
  getLastNonLoginUrl(): string {
    const pages = this.history.filter(
      (url) => !this.authPaths.some((p) => url.startsWith(p))
    );
    return pages.length ? pages[pages.length - 1] : '/';
  }
}
