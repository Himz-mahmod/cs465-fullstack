import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Authentication } from '../services/authentication';

// Send anyone who is not logged in to the login page
export const authGuard: CanActivateFn = () => {
  const auth = inject(Authentication);
  return auth.isLoggedIn() ? true : inject(Router).createUrlTree(['/login']);
};
