import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { ChartItem } from 'src/app/models/dashboard-response.model';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.sass']
})
export class DonutChartComponent {
  @ViewChild('chartContainer', { static: true })
  chartContainer!: ElementRef;

  @Input() data: ChartItem[] = [];

  private svg: any;
  private width = 500;
  private height = 300;

  ngAfterViewInit(): void {
    this.createChart();
    this.updateChart();
  }

  ngOnChanges(): void {
    if (this.svg) {
      this.updateChart();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.width = this.chartContainer.nativeElement.offsetWidth;
    this.height = Math.min(this.width, 350);
    this.updateChart();
  }

  private createChart(): void {
    this.width = this.chartContainer.nativeElement.offsetWidth;
    this.height = Math.min(this.width, 350);

    this.svg = d3.select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', '100%')
      .attr('height', this.height);
  }

  private updateChart(): void {
    this.svg.selectAll('*').remove();

    this.svg
      .attr('height', this.height)
      .attr('viewBox', `0 0 ${this.width} ${this.height}`);

    const width = this.width;
    const height = this.height;
    const radius = Math.min(width, height) / 2 - 20;

    const g = this.svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal<string>()
      .domain(this.data.map((d: ChartItem) => d.name))
      .range(d3.schemeCategory10);

    const pie = d3.pie<ChartItem>()
      .sort(null)
      .value((d: ChartItem) => d.value);

    const arc = d3.arc<d3.PieArcDatum<ChartItem>>()
      .innerRadius(radius * 0.57)
      .outerRadius(radius - 1);

    const arcs = g.selectAll('.arc')
      .data(pie(this.data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    // slice
    arcs.append('path')
      .attr('d', arc)
      .attr(
        'fill',
        (d: d3.PieArcDatum<ChartItem>) => color(d.data.name)!
      );

    // label
    const labels = arcs.append('text')
      .attr(
        'transform',
        (d: d3.PieArcDatum<ChartItem>) =>
          `translate(${arc.centroid(d)})`
      )
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('pointer-events', 'none');

    // name
    labels.append('tspan')
      .attr('x', 0)
      .attr('y', '-0.2em')
      .style('font-weight', 'bold')
      .text((d: d3.PieArcDatum<ChartItem>) => d.data.name);

    // value only if slice is large enough
    labels
      .filter(
        (d: d3.PieArcDatum<ChartItem>) =>
          (d.endAngle - d.startAngle) > 0.35
      )
      .append('tspan')
      .attr('x', 0)
      .attr('y', '1em')
      .style('fill-opacity', '0.75')
      .text((d: d3.PieArcDatum<ChartItem>) => d.data.value);

    // center text
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', -5)
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Total');

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 18)
      .style('font-size', '14px')
      .text(d3.sum(this.data, (d: ChartItem) => d.value));
  }
}
