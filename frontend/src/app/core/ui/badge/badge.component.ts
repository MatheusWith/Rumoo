import { Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'ui-badge',
  template: `
    @if (icon()) {
      <ng-icon [name]="icon()" class="h-3 w-3 shrink-0" />
    }
    <span class="text-caption leading-none"><ng-content /></span>
  `,
  host: {
    '[class]': 'classes()',
    '[attr.aria-label]': 'label() || null',
  },
  standalone: true,
  imports: [NgIcon],
})
export class UiBadgeComponent {
  variant = input<'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'>('neutral');
  icon = input('');
  label = input('');

  classes(): string {
    const color = {
      neutral: 'bg-surface-raised border border-border text-text-secondary',
      primary: 'bg-primary-subtle text-primary border border-primary',
      success: 'bg-success-subtle text-success border border-success',
      warning: 'bg-warning-subtle text-warning border border-warning',
      danger: 'bg-danger-subtle text-danger border border-danger',
      info: 'bg-info-subtle text-info border border-info',
    }[this.variant()];
    return `inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${color}`;
  }
}
