import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MenubarModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent implements OnInit {
  constructor(private router: Router) {}

  items: MenuItem[] | undefined;

  ngOnInit(): void {
    this.items = [
      {
        label: 'Login',
        command: () => {
          this.router.navigate(['/login']);
        },
      },
      {
        label: 'Signup',
        command: () => {
          this.router.navigate(['/signup']);
        },
      },
      {
        label: 'Dashboard',
        command: () => {
          this.router.navigate(['/dashboard']);
        },
      },
    ];
  }
}
