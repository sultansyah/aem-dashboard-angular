import { AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { axisBottom, axisLeft } from 'd3-axis';
import { max } from 'd3-array';
import { scaleBand, scaleLinear } from 'd3-scale';
import { Selection, select } from 'd3-selection';
import { ChartItem } from 'src/app/models/dashboard-response.model';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.sass']
})
export class BarChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('chartContainer', { static: true })
  chartContainer!: ElementRef<HTMLDivElement>;

  @Input() data: ChartItem[] = [];
  @Input() xLabel = 'Category';
  @Input() yLabel = 'Value';

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

    const margin = { top: 20, right: 20, bottom: 50, left: 60 };
    const width = this.width - margin.left - margin.right;
    const height = this.height - margin.top - margin.bottom;

    const g = this.svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = scaleBand()
      .domain(this.data.map(d => d.name))
      .range([0, width])
      .padding(0.2);

    const y = scaleLinear()
      .domain([0, max(this.data, d => d.value) || 100])
      .nice()
      .range([height, 0]);

    // bars
    g.selectAll('rect')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('x', (d: ChartItem) => x(d.name)!)
      .attr('y', (d: ChartItem) => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', (d: ChartItem) => height - y(d.value))
      .attr('fill', '#0d6efd');

    // value text above bar
    g.selectAll('.bar-label')
      .data(this.data)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', (d: ChartItem) => x(d.name)! + x.bandwidth() / 2)
      .attr('y', (d: ChartItem) => y(d.value) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text((d: ChartItem) => d.value);

    // x axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(axisBottom(x));

    // y axis
    g.append('g')
      .call(axisLeft(y));

    // x label
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 40)
      .attr('text-anchor', 'middle')
      .text(this.xLabel);

    // y label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .text(this.yLabel);
  }
}
