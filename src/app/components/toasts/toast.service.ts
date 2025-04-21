import { Injectable, TemplateRef } from '@angular/core';

export interface ToastInfor {
	textOrTpl: string | TemplateRef<any>;
	classname?: string;
	delay?: number;
}


@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toasts: ToastInfor[] = [];
  
  constructor() { }

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  showSuccess(text: string, options: any = {}) {
    this.show(text, { classname: 'bg-success text-light', ...options });
  }

  showError(text: string, options: any = {}) {
    this.show(text, { classname: 'bg-danger text-light', ...options });
  }

  showInfo(text: string, options: any = {}) {
    this.show(text, { classname: 'bg-info text-light', ...options });
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
