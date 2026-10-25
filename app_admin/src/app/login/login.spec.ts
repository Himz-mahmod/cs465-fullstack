import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { Login } from './login';
import { Authentication } from '../services/authentication';
import { History } from '../services/history';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  const authMock = { login: vi.fn() };

  beforeEach(async () => {
    authMock.login.mockReset();
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
        { provide: Authentication, useValue: authMock },
        { provide: History, useValue: { getLastNonLoginUrl: () => '/add-trip' } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shows the email and password fields', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('input[type=email]')).not.toBeNull();
    expect(el.querySelector('input[type=password]')).not.toBeNull();
  });

  it('does not call the API when fields are empty', () => {
    component.onSubmit();
    expect(authMock.login).not.toHaveBeenCalled();
    expect(component.formError()).toContain('required');
  });

  it('logs in and returns to the last page visited', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    authMock.login.mockReturnValue(of({ token: 'abc' }));
    component.loginForm.setValue({ email: 'admin@travlr.com', password: 'secret' });
    component.onSubmit();
    expect(authMock.login).toHaveBeenCalledWith('admin@travlr.com', 'secret');
    expect(navigate).toHaveBeenCalledWith('/add-trip');
  });

  it('shows an error for wrong credentials', () => {
    authMock.login.mockReturnValue(throwError(() => ({ status: 401 })));
    component.loginForm.setValue({ email: 'admin@travlr.com', password: 'wrong' });
    component.onSubmit();
    expect(component.formError()).toContain('Incorrect');
  });
});
