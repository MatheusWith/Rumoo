import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-views-switcher',
  template: `
    <div
      class="inline-flex rounded-md border border-border overflow-hidden"
      role="radiogroup"
      aria-label="View"
    >
      @for (view of views(); track view) {
        <button
          type="button"
          role="radio"
          [attr.aria-checked]="view === active()"
          [class]="
            'px-3 py-1.5 text-body-s transition-colors duration-fast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent' +
            (view === active()
              ? ' bg-primary text-on-primary'
              : ' text-text-secondary hover:bg-primary-subtle')
          "
        >
          {{ view }}
        </button>
      }
    </div>
  `,
  standalone: true,
})
export class UiViewsSwitcherComponent {
  views = input(['List', 'Board', 'Calendar']);
  active = input('List');
}
