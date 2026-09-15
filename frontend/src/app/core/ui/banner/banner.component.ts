import { Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'ui-banner',
  template: `
    <div [class]="classes()">
      <ng-icon [name]="iconMap[variant()]" class="h-4 w-4 shrink-0" />
      <span class="text-body-s text-text-primary"><ng-content /></span>
    </div>
  `,
  standalone: true,
  imports: [NgIcon],
})
export class UiBannerComponent {
  variant = input<'info' | 'warning' | 'success' | 'error'>('info');

  iconMap: Record<string, string> = {
    success: 'lucide-check-circle-2',
    info: 'lucide-info',
    warning: 'lucide-alert-triangle',
    error: 'lucide-alert-circle',
  };

  classes(): string {
    const color = {
      success: 'bg-success-subtle border-success',
      info: 'bg-info-subtle border-info',
      warning: 'bg-warning-subtle border-warning',
      error: 'bg-danger-subtle border-danger',
    }[this.variant()];
    return `flex items-center gap-2 p-3 rounded-md border ${color}`;
  }
}
