import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GuestGuard } from 'src/app/core/guards/guest.guard';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [GuestGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
