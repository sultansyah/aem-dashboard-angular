import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DashboardResponse } from '../models/dashboard-response.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getData(): Observable<DashboardResponse> {
    const fullUrl = `${this.apiUrl}/dashboard`;
    return this.http.get<DashboardResponse>(fullUrl).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error('Something went wrong');
        }
        return res;
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 0) {
      return throwError(() => new Error('Cannot connect to server'));
    }

    if (error.status === 401) {
      return throwError(() => new Error('Unauthorized'));
    }

    if (error.status === 404) {
      return throwError(() => new Error('Data not found'));
    }

    return throwError(() => new Error('Something went wrong'));
  }
}