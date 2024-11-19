import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SignupComponent } from './pages/signup/signup.component';
import { AccountComponent } from './pages/account/account.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { AuthGuard } from '../app/core/services/auth-guard/auth-guard.guard'; // Import the AuthGuard

export const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard], // Protect this route
  },
  {
    path: 'transactions',
    component: TransactionsComponent,
    canActivate: [AuthGuard], // Protect this route
  },
  {
    path: 'account/:id',
    component: AccountComponent,
    canActivate: [AuthGuard], // Protect this route
  },
];
