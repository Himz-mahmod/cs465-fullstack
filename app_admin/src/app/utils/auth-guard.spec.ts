import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, provideRouter } from '@angular/router';
import { authGuard } from './auth-guard';
import { BROWSER_STORAGE } from '../storage';
import { FakeStorage, loggedInStorage } from '../testing/mock-auth';

describe('authGuard', () => {
  function run(storage: Storage) {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: BROWSER_STORAGE, useValue: storage }]
    });
    return TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
  }

  it('lets a logged-in admin through', () => {
    expect(run(loggedInStorage())).toBe(true);
  });

  it('redirects to /login when logged out', () => {
    const result = run(new FakeStorage()) as UrlTree;
    expect(TestBed.inject(Router).serializeUrl(result)).toBe('/login');
  });
});
