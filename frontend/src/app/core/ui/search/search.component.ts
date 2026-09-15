import { Component, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'ui-search',
  template: `
    <label class="sr-only" for="search-input">Search</label>
    <div class="relative flex items-center" [class]="compact() ? 'h-8' : 'h-10'">
      <ng-icon
        name="lucide-search"
        class="absolute left-3 h-4 w-4 text-text-tertiary pointer-events-none"
      />
      <input
        id="search-input"
        (keydown.escape)="query.set(''); inputEl.value = ''"
        #inputEl
        [disabled]="disabled()"
        [(ngModel)]="query"
        class="w-full rounded-md border border-border bg-field pl-9 pr-8 text-body text-text-primary
               placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-accent
               disabled:opacity-50 disabled:bg-background disabled:cursor-not-allowed"
      />
      @if (query()) {
        <button
          type="button"
          class="absolute right-2.5 text-text-tertiary hover:text-icon"
          (click)="query.set(''); inputEl.value = ''"
          aria-label="Clear search"
        >
          <ng-icon name="lucide-x" class="h-4 w-4" />
        </button>
      }
    </div>
  `,
  standalone: true,
  imports: [FormsModule, NgIcon],
})
export class UiSearchComponent {
  compact = input(false);
  disabled = input(false);
  query = signal('');
}
