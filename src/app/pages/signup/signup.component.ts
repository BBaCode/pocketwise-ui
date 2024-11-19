import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user/user.service';
import { NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, NgIf],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  constructor(private http: UserService, private router: Router) {}

  signUpMessage: string = '';

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
      this.http
        .registerNewUser(
          this.signupForm.value.email,
          this.signupForm.value.password
        )
        .subscribe({
          next: (data: any) => {
            this.signUpMessage = data.message;
            console.log(data.message);
            this.router.navigate(['/login']);
          },
          error: (error: any) => {
            console.error(error);
          },
        });
    }
  }
}
