import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoginRequest } from 'src/app/features/auth/models/login-request.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  login(data: LoginRequest): Observable<string> {
    const fullUrl = `${this.apiUrl}/account/login`;
    return this.http.post<string>(fullUrl, data).pipe(
      map(res => {
        if (!res) throw new Error('Invalid username or password');
        return res;
      }),
      tap(res => {
        this.tokenService.setToken(res);
      }),
      catchError(this.handleLoginError)
    )
  }

  private handleLoginError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      return throwError(() => new Error('Invalid username or password'));
    }

    if (error.status === 0) {
      return throwError(() => new Error('Cannot connect to server'));
    }

    return throwError(() => new Error('Something went wrong'));
  }

  logout(): void {
    this.tokenService.clearToken();
  }

  getAuthorizationToken(): string | null {
    return this.tokenService.getToken();
  }

  isAuthenticated(): boolean {
    return !!this.getAuthorizationToken();
  }
}
