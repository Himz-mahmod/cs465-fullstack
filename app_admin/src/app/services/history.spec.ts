import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Router, provideRouter } from '@angular/router';
import { History } from './history';

@Component({ template: '' })
class Blank {}

describe('History', () => {
  let history: History;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: Blank },
          { path: 'add-trip', component: Blank },
          { path: 'login', component: Blank },
          { path: 'register', component: Blank }
        ])
      ]
    });
    history = TestBed.inject(History);
    router = TestBed.inject(Router);
  });

  it('returns / when nothing has been visited', () => {
    expect(history.getLastNonLoginUrl()).toBe('/');
  });

  it('records each finished navigation', async () => {
    await router.navigateByUrl('/');
    await router.navigateByUrl('/add-trip');
    expect(history.getHistory()).toEqual(['/', '/add-trip']);
  });

  it('skips /login and /register when finding the last page', async () => {
    await router.navigateByUrl('/add-trip');
    await router.navigateByUrl('/login');
    await router.navigateByUrl('/register');
    await router.navigateByUrl('/login');
    expect(history.getLastNonLoginUrl()).toBe('/add-trip');
  });
});
