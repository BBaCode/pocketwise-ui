import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { AuthGuard } from './auth-guard.guard';
import { AuthService } from '../auth/auth.service';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Create spies for AuthService and Router
    const authServiceMock = jasmine.createSpyObj('AuthService', [
      'getAuthToken',
    ]);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    // Configure the TestBed
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    // Inject dependencies
    authGuard = TestBed.inject(AuthGuard);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow navigation if a valid token exists', async () => {
    // Arrange
    authServiceSpy.getAuthToken.and.returnValue(Promise.resolve('valid-token'));

    // Act
    const canActivate = await authGuard.canActivate();

    // Assert
    expect(canActivate).toBeTrue();
    expect(authServiceSpy.getAuthToken).toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should block navigation and redirect to login if no valid token exists', async () => {
    // Arrange
    authServiceSpy.getAuthToken.and.returnValue(Promise.resolve(null)); // No token

    // Act
    const canActivate = await authGuard.canActivate();

    // Assert
    expect(canActivate).toBeFalse();
    expect(authServiceSpy.getAuthToken).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
