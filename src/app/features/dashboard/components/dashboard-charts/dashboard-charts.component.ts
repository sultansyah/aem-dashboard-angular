import { Component, Input } from '@angular/core';

import { ChartItem } from 'src/app/shared/models/chart.model';

@Component({
  selector: 'app-dashboard-charts',
  templateUrl: './dashboard-charts.component.html',
  styleUrls: ['./dashboard-charts.component.sass']
})
export class DashboardChartsComponent {
  @Input() chartDonut: ChartItem[] = [];
  @Input() chartBar: ChartItem[] = [];
}
