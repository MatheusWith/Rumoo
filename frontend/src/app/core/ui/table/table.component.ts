import { Component } from '@angular/core';

@Component({
  selector: 'ui-table',
  template: `
    <div class="overflow-x-auto rounded-md border border-border">
      <table class="w-full text-body-s text-text-primary">
        <ng-content />
      </table>
    </div>
  `,
  standalone: true,
})
export class UiTableComponent {}

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
  template: ` <th class="px-3 py-2 text-left font-semibold"><ng-content /></th> `,
  standalone: true,
})
export class UiThComponent {}

@Component({
  selector: 'ui-td',
  template: ` <td class="px-3 py-2"><ng-content /></td> `,
  standalone: true,
})
export class UiTdComponent {}
