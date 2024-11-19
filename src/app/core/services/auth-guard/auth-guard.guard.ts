// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): boolean {
    const token = this.userService.getToken(); // Method to get the current JWT from storage
    if (token && !this.isTokenExpired(token)) {
      return true; // Allow navigation if the token is valid
    } else {
      this.router.navigate(['/login']); // Redirect to login if not authenticated
      return false;
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp < Date.now() / 1000; // Check if token's `exp` claim has passed
    } catch (e) {
      return true; // If token is invalid, treat as expired
    }
  }
}
