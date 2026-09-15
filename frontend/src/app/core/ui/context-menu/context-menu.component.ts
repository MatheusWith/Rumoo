import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-context-menu',
  template: `
    <div class="rounded-md bg-surface-raised shadow-md border border-border py-1 w-48" role="menu">
      <button
        type="button"
        role="menuitem"
        class="flex w-full items-center gap-2 px-3 py-1.5 text-body text-text-primary hover:bg-primary-subtle"
      >
        <ng-content select="[item-1]" />
      </button>
      <button
        type="button"
        role="menuitem"
        class="flex w-full items-center gap-2 px-3 py-1.5 text-body text-text-primary hover:bg-primary-subtle"
      >
        <ng-content select="[item-2]" />
      </button>
    </div>
  `,
  standalone: true,
})
export class UiContextMenuComponent {
  label = input('');
}
