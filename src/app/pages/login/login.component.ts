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
import { Router, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { AuthService } from '../../core/services/auth/auth.service';

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
  constructor(private router: Router, private auth: AuthService) {}

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
      this.auth
        .login(
          this.loginForm.value.email.toLowerCase(),
          this.loginForm.value.password
        )
        .then((data) => {
          this.router.navigate(['/dashboard']);
        });
    }
  }
}
