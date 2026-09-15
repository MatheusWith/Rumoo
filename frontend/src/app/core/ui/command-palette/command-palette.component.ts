import { Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'ui-command-palette',
  template: `
    <button
      type="button"
      class="flex w-full items-center gap-2 rounded-md border border-border bg-field px-3 py-2 text-body text-text-tertiary hover:border-primary-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent"
      aria-label="Open command palette"
    >
      <ng-icon name="lucide-search" class="h-4 w-4" />
      Search for actions, navigation, collaborators…
      <span
        class="ml-auto rounded-md border border-border px-1.5 py-0.5 text-caption text-text-secondary"
        >⌘K</span
      >
    </button>
  `,
  standalone: true,
  imports: [NgIcon],
})
export class UiCommandPaletteComponent {
  groups = input(0);
}
