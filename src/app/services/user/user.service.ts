import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private registerUrl = 'http://localhost:80';
  private loginUrl = 'http://localhost:8080/auth/login';

  constructor(private http: HttpClient) {}

  registerNewUser(email: string, password: string): Observable<Object> {
    return this.http.post(this.registerUrl, {
      email: email,
      password: password,
    });
  }

  login(email: string, password: string): Observable<Object> {
    return this.http.post(this.loginUrl, { email, password });
  }
}
