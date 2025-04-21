import { Component, inject, TemplateRef } from '@angular/core';
import { ToastService } from './toast.service';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [NgbToastModule, NgTemplateOutlet, NgFor, NgIf],
  templateUrl: './toasts.component.html',
  styleUrl: './toasts.component.scss',
  host: { class: 'toast-container position-fixed top-0 end-0 p-3', style: 'z-index: 1200' },
})
export class ToastsComponent {

  toastService = inject(ToastService);
  isTemplate(toast: any) : toast is TemplateRef<any> {
    return toast instanceof TemplateRef;
  }
}
