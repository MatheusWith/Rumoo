import { Component, input } from '@angular/core';

@Component({
  selector: 'app-demo-section',
  template: `
    <div
      class="rounded-lg border border-border bg-surface p-5"
      [class]="fullWidth() ? 'sm:col-span-2 lg:col-span-3' : ''"
    >
      <h3 class="mb-3 text-heading-s font-semibold text-text-primary">{{ label() }}</h3>
      <ng-content />
    </div>
  `,
  standalone: true,
})
export class DemoSectionComponent {
  label = input('');
  fullWidth = input(false);
}
