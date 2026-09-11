import { Routes } from '@angular/router';
import { CallbackComponent } from './callback/callback.component';
import { authGuard } from './core/auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'callback', component: CallbackComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];
