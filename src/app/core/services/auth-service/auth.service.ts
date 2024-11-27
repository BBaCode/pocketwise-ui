import { inject, Injectable, NgZone } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { LoggedInUser, UserStoreData } from '../../models/user.model';

// move to .env file
const supabaseUrl = 'https://sbvghbgzfitnurkzuzsb.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNidmdoYmd6Zml0bnVya3p1enNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2MzQyMTQsImV4cCI6MjA0ODIxMDIxNH0.qOSO8HZurjCQNN5I12sYCKei1BX6ytJ3zS4QzDCCzuw';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase: SupabaseClient;
  private readonly ngZone = inject(NgZone);

  userAuth: BehaviorSubject<UserStoreData>;

  private authStore: {
    user: LoggedInUser | null;
    error: string | null;
  };

  private initialData = {
    user: null,
    error: null,
  };

  constructor() {
    // this code allows the client to exist permanently even though angular wants all
    // elements to "finish" initializing before it renders
    this.supabase = this.ngZone.runOutsideAngular(() =>
      createClient(supabaseUrl, supabaseKey)
    );

    this.authStore = {
      user: null,
      error: null,
    };

    this.userAuth = new BehaviorSubject(
      this.initialData
    ) as BehaviorSubject<UserStoreData>;
  }

  async signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Sign-up failed:', error.message);
        this.authStore.error = error.message;
        this.broadcastData();
        return; // Exit early if there's an error
      }

      const userData = data.user;
      if (!userData) {
        console.error('Sign-up succeeded but no user data returned');
        this.authStore.error = 'Unexpected error: no user data returned';
        this.broadcastData();
        return; // Exit if no user data
      }

      // Store additional user data in the backend
      await this.storeUserInBackend(userData, firstName, lastName);

      // Update authStore with user info
      this.authStore = {
        user: {
          email: email,
          firstName: firstName,
          lastName: lastName,
        },
        error: null,
      };
      this.broadcastData();
    } catch (error: any) {
      console.error('An error occurred:', error.message);
      this.authStore.error = error.message;
      this.broadcastData();
    }
  }

  private async storeUserInBackend(
    user: User | null,
    firstName: string,
    lastName: string
  ) {
    const response = await fetch('http://localhost:80/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${user?.access_token}`,
      },
      body: JSON.stringify({
        id: user?.id,
        email: user?.email,
        first_name: firstName,
        last_name: lastName,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to store user in backend');
    }
  }

  private broadcastData() {
    this.userAuth.next(Object.assign({}, this.authStore));
  }
}
