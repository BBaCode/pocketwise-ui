import { Component, OnInit } from '@angular/core';
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
export class NavComponent implements OnInit {
  items: MenuItem[] | undefined;
  loggedIn: boolean = false;
  auth$: Subscription;

  constructor(private auth: AuthService) {
    this.auth$ = auth.userAuth.subscribe((data) => {
      if (data.user) this.loggedIn = true;
      else this.loggedIn = false;
      this.items = [
        {
          label: 'Account',
          items: [
            !this.loggedIn
              ? {
                  label: 'Login',
                  routerLink: '/login',
                  icon: 'pi pi-sign-in',
                }
              : {
                  label: 'Logout',
                  command: () => {
                    this.auth.logout();
                  },
                  routerLink: '/login',
                  icon: 'pi pi-sign-out',
                },
            {
              label: 'Signup',
              routerLink: '/signup',
              icon: 'pi pi-user-plus',
            },
          ],
          icon: 'pi pi-user',
        },
        {
          label: 'Dashboard',
          routerLink: '/dashboard',
          icon: 'pi pi-home',
        },
        {
          label: 'Spending',
          routerLink: '/spending',
          icon: 'pi pi-credit-card',
        },
      ];
    });
  }

  ngOnInit(): void {}
}
