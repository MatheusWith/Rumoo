import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-filters',
  template: `
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-md px-3 py-2 text-body text-text-primary border border-border hover:bg-background"
      >
        Filters
        <span class="rounded-full bg-primary px-1.5 text-caption text-on-primary">{{
          activeCount()
        }}</span>
      </button>
      <div class="flex flex-wrap gap-1">
        <ng-content />
      </div>
    </div>
  `,
  standalone: true,
})
export class UiFiltersComponent {
  activeCount = input(0);
}

@Component({
  selector: 'ui-filter-chip',
  template: `
    <button
      type="button"
      class="inline-flex items-center gap-1 rounded-full bg-primary-subtle px-2 py-0.5 text-caption text-primary hover:bg-primary"
    >
      <ng-content /><span aria-hidden="true">×</span>
    </button>
  `,
  standalone: true,
})
export class UiFilterChipComponent {}
