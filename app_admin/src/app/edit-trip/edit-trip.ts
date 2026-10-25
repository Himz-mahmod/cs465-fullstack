import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TripData } from '../services/trip-data';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-trip.html',
  styleUrl: './edit-trip.css'
})
export class EditTrip implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private tripData = inject(TripData);

  tripCode = '';
  submitted = false;
  message = signal('');

  editForm = this.fb.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    length: ['', Validators.required],
    start: ['', Validators.required],
    resort: ['', Validators.required],
    perPerson: ['', Validators.required],
    image: ['', Validators.required],
    description: ['', Validators.required]
  });

  ngOnInit(): void {
    this.tripCode = this.route.snapshot.paramMap.get('tripCode') ?? '';

    this.tripData.getTrip(this.tripCode).subscribe({
      next: (data) => {
        const trip = data[0];
        if (!trip) {
          this.message.set('Trip not found.');
          return;
        }
        this.editForm.patchValue({
          code: trip.code,
          name: trip.name,
          length: trip.length,
          start: trip.start ? String(trip.start).substring(0, 10) : '',
          resort: trip.resort,
          perPerson: trip.perPerson,
          image: trip.image,
          description: trip.description
        });
      },
      error: (err) => {
        console.log('Error: ', err);
        this.message.set('Could not load the trip.');
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.editForm.valid) {
      this.tripData.updateTrip(this.tripCode, this.editForm.getRawValue() as Trip).subscribe({
        next: () => this.router.navigate(['']),
        error: (err) => console.log('Error: ', err)
      });
    }
  }
}