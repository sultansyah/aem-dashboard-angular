import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { DashboardResponse } from 'src/app/features/dashboard/models/dashboard-response.model';
import { DashboardService } from 'src/app/features/dashboard/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  dashboardData: DashboardResponse | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(showSuccessToast = false): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.dashboardService
      .getData()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: value => {
          this.dashboardData = value;

          if (showSuccessToast) {
            const message = value.isOfflineData
              ? 'Showing offline dashboard data.'
              : 'Dashboard data refreshed.';

            this.toastService.success(message);
          }
        },
        error: err => {
          if ((err as Error).message === 'Unauthorized') {
            this.authService.logout();
            this.toastService.warning('Session expired. Please login again.');
            this.router.navigate(['/login']);
            return;
          }

          this.errorMessage = err instanceof Error
            ? err.message
            : 'Something went wrong';

          this.toastService.error(this.errorMessage);
        }
      })
  }
}
