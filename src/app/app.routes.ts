import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SignupComponent } from './pages/signup/signup.component';
import { AccountComponent } from './pages/account/account.component';
import { SpendingComponent } from './pages/spending/spending.component';
import { AuthGuard } from '../app/core/services/auth-guard/auth-guard.guard'; // Import the AuthGuard
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { TransactionComponent } from './pages/transaction/transaction.component';
import { AccountGroupComponent } from './pages/account-group/account-group.component';

export const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'welcome',
    component: LandingPageComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard], // Protect this route
  },
  {
    path: 'spending',
    component: SpendingComponent,
    canActivate: [AuthGuard], // Protect this route
  },
  {
    path: 'accounts/:id',
    component: AccountGroupComponent,
    canActivate: [AuthGuard], // Protect this route
  },
  {
    path: 'accounts/:id/account/:id',
    component: AccountComponent,
    canActivate: [AuthGuard], // Protect this route
  },
  {
    path: 'transaction/:id',
    component: TransactionComponent,
    canActivate: [AuthGuard], // Protect this route
  },
  {
    path: '**',
    redirectTo: 'welcome',
  },
];
