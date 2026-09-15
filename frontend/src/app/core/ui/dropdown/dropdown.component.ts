import { Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'ui-dropdown',
  template: `
    <div class="relative inline-block">
      <button
        type="button"
        aria-haspopup="menu"
        [attr.aria-expanded]="open()"
        [class]="
          'inline-flex items-center gap-2 rounded-md px-3 py-2 text-body text-text-primary border border-border hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent' +
          (open() ? ' bg-background' : '')
        "
      >
        <ng-content select="[dropdown-trigger]" />
        <ng-icon name="lucide-chevron-down" class="h-4 w-4 text-icon" />
      </button>
      @if (open()) {
        <div
          role="menu"
          class="absolute left-0 mt-1 w-48 rounded-md bg-surface-raised shadow-md border border-border py-1 z-30"
        >
          <ng-content select="[dropdown-items]" />
        </div>
      }
    </div>
  `,
  standalone: true,
  imports: [NgIcon],
})
export class UiDropdownComponent {
  open = input(false);
}

@Component({
  selector: 'ui-menu-item',
  template: `
    <button
      type="button"
      role="menuitem"
      class="flex w-full items-center gap-2 px-3 py-1.5 text-body text-text-primary hover:bg-primary-subtle focus-visible:outline-none"
    >
      <ng-content />
    </button>
  `,
  standalone: true,
})
export class UiMenuItemComponent {}
