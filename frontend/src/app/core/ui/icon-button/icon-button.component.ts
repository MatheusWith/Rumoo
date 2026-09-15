import { Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'ui-icon-button',
  template: `
    <button
      type="button"
      [attr.aria-label]="label()"
      [disabled]="disabled()"
      class="inline-flex items-center justify-center h-8 w-8 rounded-md transition-colors
             duration-fast focus-visible:outline-2 focus-visible:outline-offset-2
             focus-visible:outline-primary-accent disabled:opacity-50 disabled:cursor-not-allowed
             hover:bg-primary-subtle text-icon bg-transparent"
    >
      <ng-icon class="h-5 w-5" [name]="icon()" />
    </button>
  `,
  standalone: true,
  imports: [NgIcon],
})
export class UiIconButtonComponent {
  icon = input.required<string>();
  label = input.required<string>();
  disabled = input(false);
}
