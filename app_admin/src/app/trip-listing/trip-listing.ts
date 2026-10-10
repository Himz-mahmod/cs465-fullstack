import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TripCard } from '../trip-card/trip-card';
import { TripData } from '../services/trip-data';

@Component({
  selector: 'app-trip-listing',
  imports: [TripCard, RouterLink],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css'
})
export class TripListing implements OnInit {
  private tripData = inject(TripData);
  trips = signal<any[]>([]);
  message = signal('');

  ngOnInit(): void {
    this.tripData.getTrips().subscribe({
      next: (data) => {
        this.trips.set(data);
        this.message.set(data.length > 0
          ? `There are ${data.length} trips available.`
          : 'There were no trips retrieved from the database.');
      },
      error: (err) => {
        console.log('Error: ', err);
        this.message.set('Could not load trips from the API.');
      }
    });
  }
}