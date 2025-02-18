import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MenubarModule, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent implements OnInit, OnDestroy {
  items: MenuItem[] | undefined;
  loggedIn: boolean = false;
  auth$?: Subscription;
  user: string | null = null;

  constructor(private auth: AuthService) {}
  ngOnInit(): void {
    this.auth$ = this.auth.userAuth.subscribe(() => {
      if (
        typeof window !== 'undefined' &&
        typeof localStorage !== 'undefined'
      ) {
        this.user = localStorage.getItem('userName');
      }
      if (this.user) this.loggedIn = true;
      else this.loggedIn = false;
      this.items = [
        {
          label: 'Account',
          items: [
            !this.loggedIn
              ? {
                  label: 'Login',
                  routerLink: '/login',
                  icon: 'fa-solid fa-sign-in',
                }
              : {
                  label: 'Logout',
                  command: () => {
                    this.auth.logout();
                  },
                  routerLink: '/login',
                  icon: 'fa-solid fa-sign-out',
                },
            {
              label: 'Signup',
              routerLink: '/signup',
              icon: 'fa-solid fa-user-plus',
            },
          ],
          icon: 'fa-solid fa-user',
        },
        {
          label: 'Dashboard',
          routerLink: '/dashboard',
          icon: 'fa-solid fa-home',
        },
        {
          label: 'Spending',
          routerLink: '/spending',
          icon: 'fa-solid fa-credit-card',
        },
        {
          label: 'Budget',
          routerLink: '/budget',
          icon: 'fa-solid fa-scale-balanced',
        },
      ];
    });
  }

  ngOnDestroy(): void {
    if (this.auth$) {
      this.auth$.unsubscribe();
    }
  }
}
