import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { LoginRequest } from 'src/app/features/auth/models/login-request.model';

import { TokenService } from './token.service';
import { LocalAuthService } from './local-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private readonly enableLocalAuthFallback = environment.enableLocalAuthFallback;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private localAuthService: LocalAuthService
  ) {}

  login(data: LoginRequest): Observable<string> {
    const fullUrl = `${this.apiUrl}/account/login`;

    return this.http.post<string>(fullUrl, data).pipe(
      map(token => {
        if (!token) {
          throw new Error('Invalid username or password');
        }

        return token;
      }),

      tap(token => this.tokenService.setToken(token)),

      switchMap(token => {
        if (!this.enableLocalAuthFallback) {
          return of(token);
        }

        return from(
          this.localAuthService
            .saveCredential(data.username, data.password, token)
            .then(() => token)
        );
      }),

      catchError(error => {
        if (this.enableLocalAuthFallback) {
          return this.loginWithLocalFallback(data);
        }

        return this.handleError(error);
      })
    );
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

  private loginWithLocalFallback(data: LoginRequest): Observable<string> {
    return from(
      this.localAuthService.validateCredential(
        data.username,
        data.password
      )
    ).pipe(
      tap(token => this.tokenService.setToken(token)),
      catchError(err => {
        if (err?.message === 'INVALID_LOGIN') {
          return throwError(() => new Error('Invalid username or password'));
        }

        return throwError(() => new Error('Cannot sign in right now. Please try again.'));
      })
    );
  }

  private handleError(error: unknown): Observable<never> {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        return throwError(() => new Error('Invalid username or password'));
      }

      if (error.status === 0) {
        return throwError(() => new Error('Cannot connect to server'));
      }
    }

    return throwError(() => new Error('Cannot sign in right now. Please try again.'));
  }
}
