import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-select',
  template: `
    <label class="sr-only" for="select-input">Select</label>
    <select
      id="select-input"
      [disabled]="disabled()"
      class="w-full rounded-md border bg-field px-3 py-2 text-body text-text-primary
             border-border focus:outline-none focus:ring-2 focus:ring-primary-accent
             disabled:opacity-50 disabled:bg-background disabled:cursor-not-allowed"
    >
      <ng-content />
    </select>
  `,
  standalone: true,
})
export class UiSelectComponent {
  disabled = input(false);
}
