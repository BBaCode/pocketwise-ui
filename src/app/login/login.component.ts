import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { HttpService } from '../services/http/register.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private http: HttpService, private router: Router) {}

  loginMessage: string = "";

  loginForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  onSubmit() {
    if (
      this.loginForm.value.email !== null &&
      this.loginForm.value.password !== null &&
      this.loginForm.value.email !== undefined &&
      this.loginForm.value.password !== undefined
    ) {
      this.http
        .registerNewUser(
          this.loginForm.value.email,
          this.loginForm.value.password
        )
        .subscribe({
          next:((data: any) => {
            this.loginMessage = data.message;
            this.router.navigate(["/dashboard"])
          }),
          error:((error: any) => {
            console.error(error)
          }),
        }
        );
    }
  }
}
