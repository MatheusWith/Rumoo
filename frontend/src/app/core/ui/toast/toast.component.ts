import { Component, input, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'ui-toast',
  template: `
    @if (visible()) {
      <div [class]="classes()" role="status">
        <ng-icon [name]="iconMap[variant()]" class="h-4 w-4 shrink-0" />
        <span class="text-body-s text-text-primary"><ng-content /></span>
        <button
          type="button"
          class="ml-2 text-text-tertiary hover:text-icon"
          (click)="visible.set(false)"
          aria-label="Dismiss"
        >
          <ng-icon name="lucide-x" class="h-3 w-3" />
        </button>
      </div>
    }
  `,
  standalone: true,
  imports: [NgIcon],
})
export class UiToastComponent {
  variant = input<'success' | 'info' | 'warning' | 'error'>('success');
  visible = signal(true);

  iconMap: Record<string, string> = {
    success: 'lucide-check-circle-2',
    info: 'lucide-info',
    warning: 'lucide-alert-triangle',
    error: 'lucide-alert-circle',
  };

  classes(): string {
    const color = {
      success: 'bg-success-subtle text-success border-success',
      info: 'bg-info-subtle text-info border-info',
      warning: 'bg-warning-subtle text-warning border-warning',
      error: 'bg-danger-subtle text-danger border-danger',
    }[this.variant()];
    return `flex items-center gap-2 p-3 rounded-md border shadow-sm max-w-sm w-full ${color}`;
  }
}
