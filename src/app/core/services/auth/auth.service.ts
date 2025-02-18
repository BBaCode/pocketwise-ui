import { inject, Injectable, NgZone } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { LoggedInUser, UserStoreData } from '../../models/user.model';
import { getSupabaseClient } from './supabase-client';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase: SupabaseClient;
  private readonly ngZone = inject(NgZone);
  private apiUrl = `https://pocketwise-server-staging.up.railway.app`; // staging
  // private apiUrl = 'http://localhost:8080'; // local

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
    this.supabase = this.ngZone.runOutsideAngular(() => getSupabaseClient());

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
      await this.storeUserInformation(userData, firstName, lastName);

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

  async login(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login failed:', error.message);
        this.authStore.error = error.message;
        this.broadcastData();
        return; // Exit early if there's an error
      }

      const userData = data.user;
      if (!userData) {
        console.error('Login succeeded but no user data returned');
        this.authStore.error = 'Unexpected error: no user data returned';
        this.broadcastData();
        return; // Exit if no user data
      }
      // Store additional user data in the backend
      await this.getUserFromDb(userData);
      // Update authStore with user info
    } catch (error: any) {
      console.error('An error occurred:', error.message);
      this.authStore.error = error.message;
      this.broadcastData();
    }
  }

  async logout() {
    try {
      const { error } = await this.supabase.auth.signOut({});

      if (error) {
        console.error('Login failed:', error.message);
        this.authStore.error = error.message;
        this.broadcastData();
        return; // Exit early if there's an error
      } else {
        this.authStore = {
          user: null,
          error: null,
        };
        localStorage.removeItem('userName');
        this.broadcastData();
      }
    } catch (error: any) {
      console.error('An error occurred:', error.message);
      this.authStore.error = error.message;
      this.broadcastData();
    }
  }

  async getAuthToken(): Promise<string | null> {
    try {
      // Retrieve the current session directly from Supabase
      const {
        data: { session },
      } = await this.supabase.auth.getSession();

      // Extract and return the access token
      return session?.access_token || null;
    } catch (error) {
      console.error('Failed to retrieve auth token:', error);
      return null;
    }
  }

  private async storeUserInformation(
    user: User | null,
    firstName: string,
    lastName: string
  ) {
    const response = await fetch(`${this.apiUrl}/signup`, {
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

  private async getUserFromDb(user: User | null) {
    await fetch(`${this.apiUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${user?.access_token}`,
      },
      body: JSON.stringify({
        id: user?.id,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to login');
        }
        // Ensure the body is used correctly
        return response.text(); // Use `text` instead of `json` temporarily
      })
      .then((text) => {
        return JSON.parse(text); // Manually parse JSON to catch any errors
      })
      .then((data: any) => {
        this.authStore = {
          user: {
            email: data.data.email,
            firstName: data.data.first_name,
            lastName: data.data.last_name,
          },
          error: null,
        };
        localStorage.setItem('userName', data.data.first_name);
        this.broadcastData();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  private broadcastData() {
    this.userAuth.next(Object.assign({}, this.authStore));
  }
}
