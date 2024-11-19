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
import { UserService } from '../../core/services/user/user.service';
import { Router, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    NgIf,
    CardModule,
    DividerModule,
    RouterLink,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private user: UserService, private router: Router) {}

  errorMessage: string = '';

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
      this.errorMessage = '';
      this.user
        .login(
          this.loginForm.value.email.toLowerCase(),
          this.loginForm.value.password
        )
        .subscribe({
          next: (data: any) => {
            this.errorMessage = data.message;
            localStorage.setItem('token', data.token);
            this.user.loadUserAuth(data.token);
            this.router.navigate(['/dashboard']);
          },
          error: (error: any) => {
            if (error.status === 401) {
              this.errorMessage =
                'Invalid email or password. Please try again.';
            } else {
              this.errorMessage =
                'An unexpected error occurred. Please try again later.';
            }
            console.error(error);
          },
        });
    }
  }
}
