import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-card',
  template: `
    <div
      [class]="
        'rounded-lg bg-surface border border-border shadow-sm transition-shadow' +
        (interactive() ? ' hover:shadow-md cursor-pointer' : '') +
        (padding() === 'comfortable' ? ' p-5' : ' p-3')
      "
    >
      @if (title()) {
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-heading-s font-semibold text-text-primary">{{ title() }}</h3>
          <ng-content select="[card-actions]" />
        </div>
      }
      <ng-content />
    </div>
  `,
  standalone: true,
})
export class UiCardComponent {
  title = input('');
  interactive = input(false);
  padding = input<'compact' | 'comfortable'>('comfortable');
}
