import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripData {
  private http = inject(HttpClient);
  private url = 'http://localhost:3000/api/trips';

  getTrips(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  getTrip(tripCode: string): Observable<any[]> {
    return this.http.get<any[]>(this.url + '/' + tripCode);
  }

  addTrip(formData: any): Observable<any> {
    return this.http.post<any>(this.url, formData);
  }

  updateTrip(tripCode: string, formData: any): Observable<any> {
    return this.http.put<any>(this.url + '/' + tripCode, formData);
  }
}