import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  private registerUrl = 'http://localhost:8080/api/users/register';

  registerNewUser(email: string, password: string) {
    return this.http.post(this.registerUrl, {
      email: email,
      password: password,
    });
  }
}
