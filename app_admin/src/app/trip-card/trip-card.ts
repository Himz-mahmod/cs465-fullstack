import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Trip } from '../models/trip';
import { TripData } from '../services/trip-data';
import { Authentication } from '../services/authentication';

@Component({
  selector: 'app-trip-card',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css'
})
export class TripCard {
  private tripData = inject(TripData);
  auth = inject(Authentication);

  @Input('trip') trip!: Trip;
  @Output() deleted = new EventEmitter<string>();

  deleteTrip(): void {
    if (!confirm(`Delete trip "${this.trip.name}"?`)) {
      return;
    }
    this.tripData.deleteTrip(this.trip.code).subscribe({
      next: () => this.deleted.emit(this.trip.code),
      error: (err) => console.log('Error: ', err)
    });
  }
}
