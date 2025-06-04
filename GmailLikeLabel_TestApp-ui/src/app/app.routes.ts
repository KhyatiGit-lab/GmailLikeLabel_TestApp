import { Routes } from '@angular/router';
import { LabelManagementComponent } from './Components/label-management/label-management.component';

export const routes: Routes = [
  { path: '', redirectTo: 'labels', pathMatch: 'full' },
  { path: 'labels', component: LabelManagementComponent },
];
