import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Authentication } from '../services/authentication';

// Attach "Authorization: Bearer <token>" to API calls once the admin is logged in.
// Login and register requests are sent without a token.
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Authentication);
  const isAuthCall = req.url.endsWith('/login') || req.url.endsWith('/register');

  if (auth.isLoggedIn() && !isAuthCall) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${auth.getToken()}` }
    });
  }
  return next(req);
};
