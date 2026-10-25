import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Authentication } from '../services/authentication';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private router = inject(Router);
  auth = inject(Authentication);

  onLogout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
