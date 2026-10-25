import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { EditTrip } from './edit-trip';
import { TripData } from '../services/trip-data';
import { trips } from '../data/trips';

describe('EditTrip', () => {
  let component: EditTrip;
  let fixture: ComponentFixture<EditTrip>;
  const tripDataMock = {
    getTrip: vi.fn(() => of([trips[0]])),
    updateTrip: vi.fn(() => of(trips[0]))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTrip],
      providers: [
        provideRouter([]),
        { provide: TripData, useValue: tripDataMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ tripCode: trips[0].code }) } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditTrip);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('loads the selected mock trip into the form', () => {
    expect(tripDataMock.getTrip).toHaveBeenCalledWith(trips[0].code);
    expect(component.editForm.value.name).toBe(trips[0].name);
    expect(component.editForm.value.start).toBe('2027-02-14');
  });

  it('saves changed values with PUT and returns to the listing', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    component.editForm.patchValue({ perPerson: '899.00' });
    component.onSubmit();
    expect(tripDataMock.updateTrip).toHaveBeenCalledWith(
      trips[0].code,
      expect.objectContaining({ perPerson: '899.00' })
    );
    expect(navigate).toHaveBeenCalledWith(['']);
  });
});
