import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'ui-tooltip',
  template: `
    <div class="relative inline-block">
      <div
        (mouseenter)="show.set(true)"
        (mouseleave)="show.set(false)"
        (focus)="show.set(true)"
        (blur)="show.set(false)"
        tabindex="0"
      >
        <ng-content />
      </div>
      @if (show()) {
        <div
          role="tooltip"
          class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50
                 px-3 py-1.5 rounded-md bg-surface-raised shadow-md
                 text-caption text-text-primary whitespace-nowrap max-w-[280px]"
        >
          {{ text() }}
        </div>
      }
    </div>
  `,
  standalone: true,
})
export class UiTooltipComponent {
  text = input('');
  show = signal(false);
}
