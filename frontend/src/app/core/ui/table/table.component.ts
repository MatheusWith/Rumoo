import { Component, input, output } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'ui-table',
  template: `
    <div class="overflow-x-auto rounded-md border border-border">
      <table
        class="w-full text-body-s text-text-primary ui-table-row-separator"
        [class.ui-table-striped]="striped()"
        [class.ui-table-bordered]="bordered()"
      >
        <ng-content />
      </table>
    </div>
  `,
  standalone: true,
})
export class UiTableComponent {
  /** Zebra striping (even rows on the background tone). */
  striped = input(false);
  /** Draw grid lines on every cell (borders instead of row separators). */
  bordered = input(false);
}

@Component({
  selector: 'ui-table-head',
  template: `<thead>
    <tr class="uppercase text-overline text-text-tertiary bg-background">
      <ng-content />
    </tr>
  </thead>`,
  standalone: true,
})
export class UiTableHeadComponent {}

@Component({
  selector: 'ui-table-body',
  template: `<tbody>
    <ng-content />
  </tbody>`,
  standalone: true,
})
export class UiTableBodyComponent {}

@Component({
  selector: 'ui-table-row',
  template: `<tr class="hover:bg-primary-subtle transition-colors duration-fast">
    <ng-content />
  </tr>`,
  standalone: true,
})
export class UiTableRowComponent {}

@Component({
  selector: 'ui-th',
  template: `
    <th
      class="px-3 ui-compact:px-2 py-2 ui-compact:py-1 text-left font-semibold whitespace-nowrap"
      [attr.aria-sort]="ariaSort()"
    >
      <span class="inline-flex items-center gap-1">
        <ng-content />
        @if (sortable()) {
          <button
            type="button"
            class="inline-flex items-center text-text-tertiary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent"
            (click)="handleSort()"
            [attr.aria-label]="'Sort by this column'"
          >
            @if (sortDirection() === 'asc') {
              <ng-icon name="lucide-arrow-up" class="h-3 w-3" />
            } @else if (sortDirection() === 'desc') {
              <ng-icon name="lucide-arrow-down" class="h-3 w-3" />
            } @else {
              <ng-icon name="lucide-chevrons-up-down" class="h-3 w-3 opacity-60" />
            }
          </button>
        }
      </span>
    </th>
  `,
  standalone: true,
  imports: [NgIcon],
})
export class UiThComponent {
  /** Turns the header into a clickable sort button. */
  sortable = input(false);
  sortDirection = input<'none' | 'asc' | 'desc'>('none');
  sort = output<string>();

  handleSort() {
    this.sort.emit(this.sortDirection() === 'asc' ? 'desc' : 'asc');
  }

  ariaSort(): string | null {
    if (!this.sortable()) return null;
    return this.sortDirection() === 'asc'
      ? 'ascending'
      : this.sortDirection() === 'desc'
        ? 'descending'
        : 'none';
  }
}

@Component({
  selector: 'ui-td',
  template: `
    <td class="px-3 ui-compact:px-2 py-2 ui-compact:py-1">
      <ng-content />
    </td>
  `,
  standalone: true,
})
export class UiTdComponent {}
