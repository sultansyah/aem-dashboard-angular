import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { DashboardResponse } from 'src/app/models/dashboard-response.model';
import { AuthService } from 'src/app/services/auth.service';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  dashboardData: DashboardResponse | null = null
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  loadDashboard() {
    this.isLoading = true

    this.dashboardService
      .getData()
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: value => this.dashboardData = value,
        error: err => {
          if ((err as Error).message === "Unauthorized") {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      })
  }
}
