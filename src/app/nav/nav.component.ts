import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MenubarModule, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent implements OnInit {
  constructor() {}

  items: MenuItem[] | undefined;

  ngOnInit(): void {
    this.items = [
      {
        label: 'Login',
        routerLink: '/login',
      },
      {
        label: 'Signup',
        routerLink: '/signup',
      },
      {
        label: 'Dashboard',
        routerLink: '/dashboard',
      },
    ];
  }
}
