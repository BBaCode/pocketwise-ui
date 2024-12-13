import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../../core/services/auth/auth.service';
import { Subscription } from 'rxjs';

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
export class SignupComponent implements OnInit, OnDestroy {
  user: string | undefined = '';
  errorMessage: string | null = '';

  // Subscription to the auth store
  user$: Subscription | undefined;

  signupForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    firstName: new FormControl<string>('', [Validators.required]),
    lastName: new FormControl<string>('', [Validators.required]),
  });

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.user$ = this.auth.userAuth.subscribe((data) => {
      if (data.user)
        this.user = data.user.firstName + ' signed up successfully!';
      this.errorMessage = data.error;
    });
  }

  ngOnDestroy(): void {
    if (this.user$) this.user$?.unsubscribe();
  }

  onSubmit() {
    if (typeof window === 'undefined') {
      console.error('Sign-up can only be executed in a browser environment.');
      return;
    }
    if (
      this.signupForm.value.email &&
      this.signupForm.value.password &&
      this.signupForm.value.firstName &&
      this.signupForm.value.lastName
    ) {
      this.auth
        .signUp(
          this.signupForm.value.email,
          this.signupForm.value.password,
          this.signupForm.value.firstName,
          this.signupForm.value.lastName
        )
        .then((data) => {
          console.log('Sign-up successful: user ', this.user);
          // navigate to another page
        })
        .catch((error) => {
          console.error('Sign-up failed:', error);
        })
        .finally(() => console.log('closed submit'));
    }
  }
}
