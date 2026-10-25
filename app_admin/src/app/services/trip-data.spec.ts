import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TripData } from './trip-data';
import { trips } from '../data/trips';

describe('TripData', () => {
  const url = 'http://localhost:3000/api/trips';
  let service: TripData;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TripData);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('GET returns the list of trips', () => {
    let result = [] as typeof trips;
    service.getTrips().subscribe((data) => (result = data));
    const req = http.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(trips);
    expect(result.length).toBe(trips.length);
  });

  it('GET by code requests a single trip', () => {
    service.getTrip(trips[0].code).subscribe();
    const req = http.expectOne(`${url}/${trips[0].code}`);
    expect(req.request.method).toBe('GET');
    req.flush([trips[0]]);
  });

  it('POST sends a new trip', () => {
    service.addTrip(trips[1]).subscribe();
    const req = http.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.code).toBe(trips[1].code);
    req.flush(trips[1]);
  });

  it('PUT sends the updated trip', () => {
    const updated = { ...trips[0], perPerson: '899.00' };
    service.updateTrip(updated.code, updated).subscribe();
    const req = http.expectOne(`${url}/${updated.code}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.perPerson).toBe('899.00');
    req.flush(updated);
  });

  it('DELETE removes a trip by code', () => {
    service.deleteTrip(trips[2].code).subscribe();
    const req = http.expectOne(`${url}/${trips[2].code}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Trip deleted', code: trips[2].code });
  });

  it('POST /login sends the credentials', () => {
    service.login('admin@travlr.com', 'secret').subscribe();
    const req = http.expectOne('http://localhost:3000/api/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'admin@travlr.com', password: 'secret' });
    req.flush({ token: 'abc' });
  });

  it('POST /register sends the new user', () => {
    service.register({ email: 'admin@travlr.com', name: 'Admin' }, 'secret').subscribe();
    const req = http.expectOne('http://localhost:3000/api/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'admin@travlr.com', name: 'Admin', password: 'secret' });
    req.flush({ token: 'abc' });
  });
});
