import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

interface PublicEndpoint {
  method: string;
  path: string;
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly apiOrigin = new URL(environment.apiUrl).origin;

  private readonly publicEndpoints: PublicEndpoint[] = [
    { method: 'POST', path: '/api/account/login' }
  ];

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.shouldAttachToken(request)) {
      return next.handle(request);
    }

    const token = this.authService.getAuthorizationToken();
    if (!token) return next.handle(request);

    const authRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next.handle(authRequest);
  }

  private shouldAttachToken(request: HttpRequest<unknown>): boolean {
    const requestUrl = new URL(request.url, window.location.origin);

    if (requestUrl.origin !== this.apiOrigin) {
      return false;
    }

    return !this.isPublicEndpoint(request.method, requestUrl.pathname);
  }

  private isPublicEndpoint(method: string, pathname: string): boolean {
    return this.publicEndpoints.some(endpoint =>
      endpoint.method === method.toUpperCase() &&
      endpoint.path === pathname
    );
  }
}
