import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private registerUrl = 'http://localhost:80';

  constructor(private http: HttpClient) {}

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
}
