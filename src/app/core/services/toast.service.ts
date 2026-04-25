import { Injectable } from '@angular/core';
import { ToastData } from 'src/app/shared/models/toast.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private counter = 0;
  private toasts: ToastData[] = [];

  private toastSubject = new BehaviorSubject<ToastData[]>([]);
  readonly toast$ = this.toastSubject.asObservable();

  show(
    message: string,
    type: ToastData['type'] = 'info',
    duration = 3000
  ) {
    const toast: ToastData = {
      id: this.counter++,
      message,
      type
    };

    this.toasts = [...this.toasts, toast];
    this.toastSubject.next(this.toasts);

    setTimeout(() => {
      this.remove(toast.id);
    }, duration);
  }

  remove(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.toastSubject.next(this.toasts);
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  warning(message: string) {
    this.show(message, 'warning');
  }

  info(message: string) {
    this.show(message, 'info');
  }
}
