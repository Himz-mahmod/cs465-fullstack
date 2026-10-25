import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TripCard } from '../trip-card/trip-card';
import { TripData } from '../services/trip-data';
import { Trip } from '../models/trip';
import { Authentication } from '../services/authentication';

@Component({
  selector: 'app-trip-listing',
  imports: [TripCard, RouterLink],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css'
})
export class TripListing implements OnInit {
  private tripData = inject(TripData);
  auth = inject(Authentication);
  trips = signal<Trip[]>([]);
  message = signal('');

  ngOnInit(): void {
    this.tripData.getTrips().subscribe({
      next: (data) => {
        this.trips.set(data);
        this.setMessage();
      },
      error: (err) => {
        console.log('Error: ', err);
        this.message.set('Could not load trips from the API.');
      }
    });
  }

  // Remove a trip from the list after the card deletes it through the API
  onTripDeleted(code: string): void {
    this.trips.update((list) => list.filter((t) => t.code !== code));
    this.setMessage();
  }

  private setMessage(): void {
    const count = this.trips().length;
    this.message.set(count > 0
      ? `There are ${count} trips available.`
      : 'There were no trips retrieved from the database.');
  }
}
