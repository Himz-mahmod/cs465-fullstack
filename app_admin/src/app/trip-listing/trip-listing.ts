import { Component } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { trips } from '../data/trips';

@Component({
  selector: 'app-trip-listing',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css'
})
export class TripListing {
  trips: any[] = trips;
}