import { Component, input } from '@angular/core';

@Component({
  selector: 'ul[ui-list]',
  template: `<ng-content />`,
  host: {
    class: 'divide-y divide-border rounded-md bg-surface border border-border overflow-hidden',
  },
  standalone: true,
})
export class UiListComponent {
  condensed = input(false);
}

@Component({
  selector: 'li[ui-list-row]',
  template: `<ng-content />`,
  host: {
    class:
      'flex items-center gap-3 px-3 transition-colors duration-fast hover:bg-primary-subtle focus-within:bg-primary-subtle',
  },
  standalone: true,
})
export class UiListRowComponent {
  selected = input(false);
}
