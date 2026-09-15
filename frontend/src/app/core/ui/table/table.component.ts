import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-table',
  template: `
    <div class="overflow-x-auto rounded-md border border-border">
      <table
        class="w-full text-body-s text-text-primary"
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
  /** Draw vertical/horizontal grid lines on every cell. */
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
  template: `<tbody class="divide-y divide-divider">
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
    <th class="px-3 ui-compact:px-2 py-2 ui-compact:py-1 text-left font-semibold">
      <ng-content />
    </th>
  `,
  standalone: true,
})
export class UiThComponent {}

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
