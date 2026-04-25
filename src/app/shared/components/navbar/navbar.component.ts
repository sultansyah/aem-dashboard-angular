import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent {
  isModalOpen = false;
  
  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) { }

  logout(): void {
    this.authService.logout();
    this.toastService.success('Logout successful. Redirecting to login...');
    this.router.navigate(['/login']);
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
}
