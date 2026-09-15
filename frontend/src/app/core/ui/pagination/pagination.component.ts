import { Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'ui-pagination',
  template: `
    <nav aria-label="Pagination" class="flex items-center gap-2">
      <button
        type="button"
        class="rounded-md px-2 py-1 text-body text-text-primary hover:bg-primary-subtle disabled:opacity-40"
        [disabled]="page() <= 1"
      >
        <ng-icon name="lucide-chevron-left" class="h-4 w-4 mr-1 inline" />Previous
      </button>
      <span class="text-body-s text-text-secondary">Page {{ page() }} of {{ total() }}</span>
      <button
        type="button"
        class="rounded-md px-2 py-1 text-body text-text-primary hover:bg-primary-subtle disabled:opacity-40"
        [disabled]="page() >= total()"
      >
        Next<ng-icon name="lucide-chevron-right" class="h-4 w-4 ml-1 inline" />
      </button>
    </nav>
  `,
  standalone: true,
  imports: [NgIcon],
})
export class UiPaginationComponent {
  page = input(1);
  total = input(1);
}
