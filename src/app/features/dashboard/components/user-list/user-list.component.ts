import { Component, Input } from '@angular/core';

import { UserItem } from '../../models/dashboard-response.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.sass']
})
export class UserListComponent {
  @Input() users: UserItem[] = [];

  trackByUsername(index: number, item: UserItem): string {
    return item.username;
  }
}
