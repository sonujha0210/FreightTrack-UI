import { Routes } from '@angular/router';
import { LoginComponent } from './Auth/login/login';
import { RegisterComponent } from './Auth/register/register';
import { LayoutComponent } from './layout/layout';
import { AuthGuard } from './Auth/auth-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'shipments', pathMatch: 'full' },
      {
        path: 'shipments',
        children: [
          { path: '', loadComponent: () => import('./shipments/shipment-list/shipment-list.component').then(m => m.ShipmentListComponent) },
          { path: 'new', loadComponent: () => import('./shipments/shipment-create/shipment-create.component').then(m => m.ShipmentCreateComponent) },
          { path: ':id', loadComponent: () => import('./shipments/shipment-detail/shipment-detail.component').then(m => m.ShipmentDetailComponent) },
          { path: ':id/history', loadComponent: () => import('./shipments/shipment-history/shipment-history.component').then(m => m.ShipmentHistoryComponent) }
        ]
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
