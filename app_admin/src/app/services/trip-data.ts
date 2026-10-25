import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';

@Injectable({
  providedIn: 'root'
})
export class TripData {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api';
  private url = this.baseUrl + '/trips';

  // GET /api/trips
  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.url);
  }

  // GET /api/trips/:tripCode (the API returns an array with one trip)
  getTrip(tripCode: string): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.url + '/' + tripCode);
  }

  // POST /api/trips
  addTrip(formData: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.url, formData);
  }

  // PUT /api/trips/:tripCode
  updateTrip(tripCode: string, formData: Trip): Observable<Trip> {
    return this.http.put<Trip>(this.url + '/' + tripCode, formData);
  }

  // DELETE /api/trips/:tripCode
  deleteTrip(tripCode: string): Observable<{ message: string; code: string }> {
    return this.http.delete<{ message: string; code: string }>(this.url + '/' + tripCode);
  }

  // POST /api/login
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.baseUrl + '/login', { email, password });
  }

  // POST /api/register
  register(user: User, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.baseUrl + '/register', { ...user, password });
  }
}
