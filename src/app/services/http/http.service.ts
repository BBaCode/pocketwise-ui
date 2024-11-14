import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  private registerUrl = 'http://localhost:8080/api/users/register';

  registerNewUser(email: string, password: string): Observable<Object> {
    return this.http.post(this.registerUrl, {
      email: email,
      password: password,
    });
  }
}
