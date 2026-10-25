import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { TripListing } from './trip-listing';
import { TripData } from '../services/trip-data';
import { BROWSER_STORAGE } from '../storage';
import { trips } from '../data/trips';
import { FakeStorage, loggedInStorage } from '../testing/mock-auth';

describe('TripListing', () => {
  async function render(storage: Storage) {
    await TestBed.configureTestingModule({
      imports: [TripListing],
      providers: [
        provideRouter([]),
        { provide: TripData, useValue: { getTrips: () => of(trips) } },
        { provide: BROWSER_STORAGE, useValue: storage }
      ]
    }).compileComponents();
    const fixture = TestBed.createComponent(TripListing);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('shows one card per mock trip', async () => {
    const fixture = await render(new FakeStorage());
    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll('app-trip-card');
    expect(cards.length).toBe(trips.length);
    expect(fixture.componentInstance.message()).toContain(`${trips.length} trips`);
  });

  it('hides Add Trip when logged out', async () => {
    const el = (await render(new FakeStorage())).nativeElement as HTMLElement;
    expect(el.textContent).not.toContain('Add Trip');
  });

  it('shows Add Trip when logged in', async () => {
    const el = (await render(loggedInStorage())).nativeElement as HTMLElement;
    expect(el.textContent).toContain('Add Trip');
  });

  it('removes a card after a trip is deleted', async () => {
    const fixture = await render(loggedInStorage());
    fixture.componentInstance.onTripDeleted(trips[0].code);
    fixture.detectChanges();
    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll('app-trip-card');
    expect(cards.length).toBe(trips.length - 1);
  });
});
