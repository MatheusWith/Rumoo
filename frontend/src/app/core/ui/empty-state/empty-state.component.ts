import { Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'ui-empty-state',
  template: `
    <div class="flex flex-col items-center text-center py-16 px-4">
      <ng-icon [name]="icon()" class="h-8 w-8 text-text-tertiary mb-4" />
      <h3 class="text-heading-m font-semibold text-text-primary mb-2">{{ title() }}</h3>
      <p class="text-body text-text-secondary mb-6 max-w-md">{{ message() }}</p>
      <ng-content />
    </div>
  `,
  standalone: true,
  imports: [NgIcon],
})
export class UiEmptyStateComponent {
  icon = input('lucide-inbox');
  title = input('Nothing here');
  message = input('');
}
