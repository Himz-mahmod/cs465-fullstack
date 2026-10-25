import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { AddTrip } from './add-trip';
import { TripData } from '../services/trip-data';
import { trips } from '../data/trips';

describe('AddTrip', () => {
  let component: AddTrip;
  let fixture: ComponentFixture<AddTrip>;
  const tripDataMock = { addTrip: vi.fn(() => of(trips[0])) };

  beforeEach(async () => {
    tripDataMock.addTrip.mockClear();
    await TestBed.configureTestingModule({
      imports: [AddTrip],
      providers: [provideRouter([]), { provide: TripData, useValue: tripDataMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(AddTrip);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('does not submit an empty form', () => {
    component.onSubmit();
    expect(component.addForm.invalid).toBe(true);
    expect(tripDataMock.addTrip).not.toHaveBeenCalled();
  });

  it('submits a filled form to the API and returns to the listing', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const { _id, ...trip } = { ...trips[0], start: '2027-02-14' };
    component.addForm.setValue(trip);
    component.onSubmit();
    expect(tripDataMock.addTrip).toHaveBeenCalledWith(trip);
    expect(navigate).toHaveBeenCalledWith(['']);
  });
});
