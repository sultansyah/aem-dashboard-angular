import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError, map, from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DashboardResponse } from '../models/dashboard-response.model';
import { LocalDashboardService } from '../../../core/services/local-dashboard.service';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly apiUrl = environment.apiUrl;
  private readonly enableLocalAuthFallback = environment.enableLocalAuthFallback;

  constructor(
    private http: HttpClient,
    private localDashboardService: LocalDashboardService
  ) { }

  getData(): Observable<DashboardResponse> {
    const fullUrl = `${this.apiUrl}/dashboard`;
    return this.http.get<DashboardResponse>(fullUrl).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error('Something went wrong');
        }
        return res;
      }),
      switchMap(res => {
        const lastFetchedAt = new Date().toISOString();

        return from(
          this.localDashboardService.saveData(
            res.chartDonut,
            res.chartBar,
            res.tableUsers,
            lastFetchedAt
          )
        ).pipe(
          map(() => ({
            ...res,
            isOfflineData: false,
            lastFetchedAt
          }))
        );
      }),
      catchError(error => {
        if (
          this.enableLocalAuthFallback
          && error instanceof HttpErrorResponse
          && error.status === 0
        ) {
          return from(this.localDashboardService.getData());
        }

        return this.handleError(error)
      })
    );
  }

  private handleError(error: unknown): Observable<never> {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return throwError(() => new Error('Cannot connect to server'));
      }

      if (error.status === 401) {
        return throwError(() => new Error('Unauthorized'));
      }

      if (error.status === 404) {
        return throwError(() => new Error('Data not found'));
      }
    }

    return throwError(() => new Error('Something went wrong'));
  }
}
