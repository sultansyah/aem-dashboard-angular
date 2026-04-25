import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast.service';
import { ToastData } from 'src/app/shared/models/toast.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.sass'],
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-12px) scale(.95)'
        }),
        animate(
          '250ms ease-out',
          style({
            opacity: 1,
            transform: 'translateY(0) scale(1)'
          })
        )
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({
            opacity: 0,
            transform: 'translateX(30px) scale(.95)'
          })
        )
      ])
    ])
  ]
})
export class ToastComponent {
  toasts$: Observable<ToastData[]>;

  constructor(private toastService: ToastService) {
    this.toasts$ = this.toastService.toast$;
  }

  trackById(index: number, item: ToastData): number {
    return item.id
  }

  remove(id: number) {
    this.toastService.remove(id)
  }
}
