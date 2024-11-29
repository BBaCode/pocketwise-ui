import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth-service/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MenubarModule, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent implements OnInit {
  constructor(private auth: AuthService) {}

  items: MenuItem[] | undefined;

  ngOnInit(): void {
    this.items = [
      {
        label: 'Account',
        items: [
          {
            label: 'Login',
            routerLink: '/login',
            icon: 'pi pi-sign-in',
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
        label: 'Transactions',
        routerLink: '/transactions',
        icon: 'pi pi-credit-card',
      },
      {
        label: 'Logout',
        command: () => {
          this.auth.logout();
        },
        routerLink: '/login',
        icon: 'pi pi-sign-out',
      },
    ];
  }
}
