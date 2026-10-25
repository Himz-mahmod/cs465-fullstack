import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { jwtInterceptor } from './jwt-interceptor';
import { BROWSER_STORAGE } from '../storage';
import { FakeStorage, makeToken } from '../testing/mock-auth';

describe('jwtInterceptor', () => {
  const api = 'http://localhost:3000/api';
  let http: HttpClient;
  let ctrl: HttpTestingController;
  let storage: FakeStorage;

  beforeEach(() => {
    storage = new FakeStorage();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([jwtInterceptor])),
        provideHttpClientTesting(),
        { provide: BROWSER_STORAGE, useValue: storage }
      ]
    });
    http = TestBed.inject(HttpClient);
    ctrl = TestBed.inject(HttpTestingController);
  });

  afterEach(() => ctrl.verify());

  it('adds the Bearer token when logged in', () => {
    const token = makeToken();
    storage.setItem('travlr-token', token);
    http.delete(`${api}/trips/GALR210214`).subscribe();
    const req = ctrl.expectOne(`${api}/trips/GALR210214`);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush({});
  });

  it('sends no token when logged out', () => {
    http.post(`${api}/trips`, {}).subscribe();
    const req = ctrl.expectOne(`${api}/trips`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('does not add the token to the login request', () => {
    storage.setItem('travlr-token', makeToken());
    http.post(`${api}/login`, {}).subscribe();
    const req = ctrl.expectOne(`${api}/login`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
