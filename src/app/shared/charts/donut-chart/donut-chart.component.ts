import { AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { sum } from 'd3-array';
import { scaleOrdinal } from 'd3-scale';
import { Selection, select } from 'd3-selection';
import { arc, pie, PieArcDatum } from 'd3-shape';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { ChartItem } from 'src/app/shared/models/chart.model';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.sass']
})
export class DonutChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('chartContainer', { static: true })
  chartContainer!: ElementRef<HTMLDivElement>;

  @Input() data: ChartItem[] = [];

  private svg: Selection<SVGSVGElement, unknown, null, undefined> | null = null;
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

  ngOnDestroy(): void {
    this.svg?.remove();
    this.svg = null;
  }

  private createChart(): void {
    this.width = this.chartContainer.nativeElement.offsetWidth;
    this.height = Math.min(this.width, 350);

    this.svg = select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', '100%')
      .attr('height', this.height);
  }

  private updateChart(): void {
    if (!this.svg) return;

    this.svg.selectAll('*').remove();

    this.svg
      .attr('height', this.height)
      .attr('viewBox', `0 0 ${this.width} ${this.height}`);

    const width = this.width;
    const height = this.height;
    const radius = Math.min(width, height) / 2 - 20;

    const g = this.svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = scaleOrdinal<string>()
      .domain(this.data.map((d: ChartItem) => d.name))
      .range(schemeCategory10);

    const chartPie = pie<ChartItem>()
      .sort(null)
      .value((d: ChartItem) => d.value);

    const chartArc = arc<PieArcDatum<ChartItem>>()
      .innerRadius(radius * 0.57)
      .outerRadius(radius - 1);

    const arcs = g.selectAll('.arc')
      .data(chartPie(this.data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    // slice
    arcs.append('path')
      .attr('d', chartArc)
      .attr(
        'fill',
        (d: PieArcDatum<ChartItem>) => color(d.data.name)!
      );

    // label
    const labels = arcs.append('text')
      .attr(
        'transform',
        (d: PieArcDatum<ChartItem>) =>
          `translate(${chartArc.centroid(d)})`
      )
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('pointer-events', 'none');

    // name
    labels.append('tspan')
      .attr('x', 0)
      .attr('y', '-0.2em')
      .style('font-weight', 'bold')
      .style('fill', 'white')
      .text((d: PieArcDatum<ChartItem>) => d.data.name);

    // value only if slice is large enough
    labels
      .filter(
        (d: PieArcDatum<ChartItem>) =>
          (d.endAngle - d.startAngle) > 0.35
      )
      .append('tspan')
      .attr('x', 0)
      .attr('y', '1em')
      .style('fill', 'white')
      .style('font-weight', 'bold')
      .text((d: PieArcDatum<ChartItem>) => d.data.value);

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
      .text(sum(this.data, (d: ChartItem) => d.value));
  }
}
