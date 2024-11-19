import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private registerUrl = 'http://localhost:80';
  userAuthentication: BehaviorSubject<any>;
  private userStore: {
    token: string;
  };

  private initialData = {
    token: '',
  };

  constructor(private http: HttpClient) {
    this.userStore = {
      token: '',
    };

    this.userAuthentication = new BehaviorSubject<any>(this.initialData);
    console.log('init user store:', this.userStore);
  }

  registerNewUser(email: string, password: string): Observable<Object> {
    return this.http.post(`${this.registerUrl}/signup`, {
      email: email,
      password: password,
    });
  }

  // will need to do some kind of JWT to maintain state of user in the browser
  login(email: string, password: string): Observable<Object> {
    return this.http.post(`${this.registerUrl}/login`, {
      email: email,
      password: password,
    });
  }

  loadUserAuth(token: string) {
    this.userStore.token = token;
    this.updateConsumers();
  }

  getToken() {
    return localStorage.getItem('token');
  }

  // when next is called, all subscribers get the new data
  private updateConsumers() {
    this.userAuthentication.next({ ...this.userStore });
    console.log('updating consumers with user', this.userStore);
  }
}
