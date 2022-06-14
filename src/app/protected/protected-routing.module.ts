import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: DashboardComponent },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ProtectedRoutingModule { }
