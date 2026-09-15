import { Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'ui-button',
  template: `<button [type]="type()" [disabled]="disabled() || loading()" [class]="classes()">
    @if (loading()) {
      <span class="animate-spin mr-2 inline-block">
        <ng-icon name="lucide-loader-2" />
      </span>
    }
    <ng-content />
  </button>`,
  standalone: true,
  imports: [NgIcon],
})
export class UiButtonComponent {
  type = input<'button' | 'submit' | 'reset'>('button');
  variant = input<'primary' | 'secondary' | 'tertiary' | 'danger'>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  disabled = input(false);
  loading = input(false);

  classes(): string {
    const base =
      'inline-flex items-center justify-center font-medium transition-colors duration-fast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent disabled:opacity-50 disabled:cursor-not-allowed rounded-md';
    const sizeMap: Record<string, string> = {
      sm: 'px-2 py-1 text-body-s h-8',
      md: 'px-4 ui-compact:px-3 py-2 ui-compact:py-1 text-body h-10 ui-compact:h-8',
      lg: 'px-6 ui-compact:px-4 py-3 ui-compact:py-2 text-body-l h-12 ui-compact:h-10',
    };
    const variantMap: Record<string, string> = {
      primary: 'bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-active',
      secondary: 'bg-transparent text-text-primary border border-border hover:bg-background',
      tertiary: 'bg-transparent text-primary hover:bg-primary-subtle',
      danger: 'bg-danger-solid text-on-primary hover:bg-danger',
    };
    return `${base} ${sizeMap[this.size()]} ${variantMap[this.variant()]}`;
  }
}
