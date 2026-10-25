import { InjectionToken } from '@angular/core';

// Wraps localStorage so tests can swap in a fake storage object
export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage
});
