import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent {
  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) { }

  logout(): void {
    this.toastService.success('Logout successful. Redirecting to login...');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
