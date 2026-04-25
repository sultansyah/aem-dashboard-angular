import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarChartComponent } from './charts/bar-chart/bar-chart.component';
import { DonutChartComponent } from './charts/donut-chart/donut-chart.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToastComponent } from './components/toast/toast.component';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  declarations: [
    BarChartComponent,
    DonutChartComponent,
    NavbarComponent,
    ToastComponent,
    ModalComponent
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
    ModalComponent,
    ToastComponent
  ]
})
export class SharedModule { }
