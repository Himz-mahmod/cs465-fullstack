import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { Navbar } from './navbar';
import { BROWSER_STORAGE } from '../storage';
import { FakeStorage, loggedInStorage } from '../testing/mock-auth';

describe('Navbar', () => {
  async function render(storage: Storage) {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [provideRouter([]), { provide: BROWSER_STORAGE, useValue: storage }]
    }).compileComponents();
    const fixture = TestBed.createComponent(Navbar);
    fixture.detectChanges();
    return fixture;
  }

  it('shows Log in when logged out', async () => {
    const el = (await render(new FakeStorage())).nativeElement as HTMLElement;
    expect(el.textContent).toContain('Log in');
    expect(el.textContent).not.toContain('Log out');
  });

  it('shows the admin name and Log out when logged in', async () => {
    const el = (await render(loggedInStorage())).nativeElement as HTMLElement;
    expect(el.textContent).toContain('Test Admin');
    expect(el.textContent).toContain('Log out');
  });

  it('clears the token on logout', async () => {
    const storage = loggedInStorage();
    const fixture = await render(storage);
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture.componentInstance.onLogout();
    expect(storage.getItem('travlr-token')).toBeNull();
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });
});
