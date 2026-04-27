import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DashboardLayoutComponent } from 'src/app/layouts/dashboard-layout/dashboard-layout.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardChartsComponent } from './components/dashboard-charts/dashboard-charts.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { DashboardSkeletonComponent } from './components/dashboard-skeleton/dashboard-skeleton.component';
import { ClientPaginationComponent } from 'src/app/shared/components/client-pagination/client-pagination.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardLayoutComponent,
    DashboardChartsComponent,
    UserListComponent,
    DashboardSkeletonComponent,
    ClientPaginationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
