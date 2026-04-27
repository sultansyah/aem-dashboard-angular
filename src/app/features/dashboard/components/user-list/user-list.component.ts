import { Component, Input } from '@angular/core';

import { UserItem } from '../../models/dashboard-response.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.sass']
})
export class UserListComponent {
  @Input() users: UserItem[] = [];

  currentPage = 1;
  pageSizeOptions = [5, 10, 20, 50];
  pageSize = this.pageSizeOptions[0];

  trackByUsername(index: number, item: UserItem): string {
    return item.username;
  }

  get paginatedUsers(): UserItem[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.users.slice(start, start + this.pageSize);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
  }
}
