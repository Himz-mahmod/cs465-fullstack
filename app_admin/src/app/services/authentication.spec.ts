import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Authentication } from './authentication';
import { TripData } from './trip-data';
import { BROWSER_STORAGE } from '../storage';
import { FakeStorage, makeToken } from '../testing/mock-auth';

describe('Authentication', () => {
  let auth: Authentication;
  let storage: FakeStorage;
  const token = makeToken();

  beforeEach(() => {
    storage = new FakeStorage();
    TestBed.configureTestingModule({
      providers: [
        { provide: BROWSER_STORAGE, useValue: storage },
        {
          provide: TripData,
          useValue: {
            login: () => of({ token }),
            register: () => of({ token })
          }
        }
      ]
    });
    auth = TestBed.inject(Authentication);
  });

  it('is logged out when there is no token', () => {
    expect(auth.isLoggedIn()).toBe(false);
    expect(auth.getCurrentUser()).toBeNull();
  });

  it('is logged out when the token has expired', () => {
    storage.setItem('travlr-token', makeToken(-60));
    expect(auth.isLoggedIn()).toBe(false);
  });

  it('is logged out when the token is not a valid JWT', () => {
    storage.setItem('travlr-token', 'not-a-token');
    expect(auth.isLoggedIn()).toBe(false);
  });

  it('saves the token on login and reads the user from it', () => {
    auth.login('admin@travlr.com', 'secret').subscribe();
    expect(storage.getItem('travlr-token')).toBe(token);
    expect(auth.isLoggedIn()).toBe(true);
    expect(auth.getCurrentUser()).toEqual({ email: 'admin@travlr.com', name: 'Test Admin' });
  });

  it('saves the token on register', () => {
    auth.register({ email: 'admin@travlr.com', name: 'Test Admin' }, 'secret').subscribe();
    expect(auth.isLoggedIn()).toBe(true);
  });

  it('removes the token on logout', () => {
    storage.setItem('travlr-token', token);
    auth.logout();
    expect(auth.isLoggedIn()).toBe(false);
  });
});
