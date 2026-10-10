import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TripData } from '../services/trip-data';

@Component({
  selector: 'app-add-trip',
  imports: [ReactiveFormsModule],
  templateUrl: './add-trip.html',
  styleUrl: './add-trip.css'
})
export class AddTrip {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private tripData = inject(TripData);

  submitted = false;

  addForm = this.fb.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    length: ['', Validators.required],
    start: ['', Validators.required],
    resort: ['', Validators.required],
    perPerson: ['', Validators.required],
    image: ['', Validators.required],
    description: ['', Validators.required]
  });

  onSubmit(): void {
    this.submitted = true;
    if (this.addForm.valid) {
      this.tripData.addTrip(this.addForm.value).subscribe({
        next: () => this.router.navigate(['']),
        error: (err) => console.log('Error: ', err)
      });
    }
  }
}