import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarChartComponent } from './charts/bar-chart/bar-chart.component';
import { DonutChartComponent } from './charts/donut-chart/donut-chart.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToastComponent } from './components/toast/toast.component';

@NgModule({
  declarations: [
    BarChartComponent,
    DonutChartComponent,
    NavbarComponent,
    ToastComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    BarChartComponent,
    DonutChartComponent,
    NavbarComponent,
    ToastComponent
  ]
})
export class SharedModule { }
