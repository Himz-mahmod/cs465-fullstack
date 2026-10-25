import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { TripCard } from './trip-card';
import { TripData } from '../services/trip-data';
import { BROWSER_STORAGE } from '../storage';
import { trips } from '../data/trips';
import { FakeStorage, loggedInStorage } from '../testing/mock-auth';

describe('TripCard', () => {
  const tripDataMock = { deleteTrip: vi.fn(() => of({ message: 'Trip deleted', code: trips[0].code })) };

  async function render(storage: Storage) {
    await TestBed.configureTestingModule({
      imports: [TripCard],
      providers: [
        provideRouter([]),
        { provide: TripData, useValue: tripDataMock },
        { provide: BROWSER_STORAGE, useValue: storage }
      ]
    }).compileComponents();
    const fixture = TestBed.createComponent(TripCard);
    fixture.componentRef.setInput('trip', trips[0]);
    fixture.detectChanges();
    return fixture;
  }

  it('renders the mock trip details', async () => {
    const el = (await render(new FakeStorage())).nativeElement as HTMLElement;
    expect(el.querySelector('.card-title')?.textContent).toContain(trips[0].name);
    expect(el.textContent).toContain(trips[0].resort);
  });

  it('hides Edit and Delete when logged out', async () => {
    const el = (await render(new FakeStorage())).nativeElement as HTMLElement;
    expect(el.textContent).not.toContain('Edit Trip');
    expect(el.textContent).not.toContain('Delete Trip');
  });

  it('shows Edit linked to the edit route when logged in', async () => {
    const el = (await render(loggedInStorage())).nativeElement as HTMLElement;
    const link = el.querySelector('a.btn-info');
    expect(link?.getAttribute('href')).toBe(`/edit-trip/${trips[0].code}`);
    expect(el.textContent).toContain('Delete Trip');
  });

  it('deletes the trip and emits its code', async () => {
    const component = (await render(loggedInStorage())).componentInstance;
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    let emitted = '';
    component.deleted.subscribe((code) => (emitted = code));
    component.deleteTrip();
    expect(tripDataMock.deleteTrip).toHaveBeenCalledWith(trips[0].code);
    expect(emitted).toBe(trips[0].code);
  });
});
