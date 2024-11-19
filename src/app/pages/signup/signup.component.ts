import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user/user.service';
import { NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    NgIf,
    IconFieldModule,
    InputIconModule,
    CardModule,
    DividerModule,
    RouterLink,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  constructor(private user: UserService, private router: Router) {}

  errorMessage: string = '';

  signupForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  onSubmit() {
    if (
      this.signupForm.value.email !== null &&
      this.signupForm.value.password !== null &&
      this.signupForm.value.email !== undefined &&
      this.signupForm.value.password !== undefined
    ) {
      this.user
        .registerNewUser(
          this.signupForm.value.email,
          this.signupForm.value.password
        )
        .subscribe({
          next: (data: any) => {
            console.log(data.message);
            this.router.navigate(['/login']);
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
