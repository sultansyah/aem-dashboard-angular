import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-client-pagination',
  templateUrl: './client-pagination.component.html',
  styleUrls: ['./client-pagination.component.sass']
})
export class ClientPaginationComponent implements OnChanges {
  @Input() currentPage = 1;
  @Input() totalItems = 1;
  @Input() pageSizeOptions = [5, 10, 20, 50];
  @Input() pageSize = this.pageSizeOptions[0];

  @Output() pageChanged = new EventEmitter<number>();
  @Output() pageSizeChanged = new EventEmitter<number>();

  totalPages: number[] = [];
  totalPageCount = 0;
  totalLeftRightPages = 1;

  ngOnChanges(): void {
    this.changeTotalPages();
  }

  changeTotalPages(): void {
    this.totalPageCount = Math.ceil(this.totalItems / this.pageSize);

    const startPage = Math.max(1, this.currentPage - this.totalLeftRightPages);
    const endPage = Math.min(this.totalPageCount, this.currentPage + this.totalLeftRightPages);

    this.totalPages = Array(endPage - startPage + 1)
      .fill(0)
      .map((_, index) => startPage + index);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPageCount) {
      return;
    }

    this.currentPage = page;
    this.pageChanged.emit(page);
  }

  changePageSize(event: Event): void {
    const selectedSize = Number((event.target as HTMLSelectElement).value);
    const size = this.pageSizeOptions.includes(selectedSize) ? selectedSize : this.pageSizeOptions[0];

    this.currentPage = 1;
    this.pageSizeChanged.emit(size);
  }

  hasNextPage(): boolean {
    return this.currentPage < this.totalPageCount;
  }

  hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }
}
