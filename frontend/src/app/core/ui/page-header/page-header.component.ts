import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-page-header',
  template: `
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0">
        <h1 class="text-heading-l font-semibold text-text-primary">{{ title() }}</h1>
        @if (subtitle()) {
          <p class="mt-1 text-body text-text-secondary">{{ subtitle() }}</p>
        }
      </div>
      @if (showActions()) {
        <div class="flex flex-wrap items-center gap-2 shrink-0">
          <ng-content select="[page-actions]" />
        </div>
      }
    </div>
  `,
  standalone: true,
})
export class UiPageHeaderComponent {
  title = input.required<string>();
  subtitle = input('');
  showActions = input(true);
}
