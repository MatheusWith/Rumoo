import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-tabs',
  template: `
    <div role="tablist" class="flex border-b border-border">
      <ng-content />
    </div>
  `,
  standalone: true,
  host: { '(keydown.arrowRight)': 'onKeyDown($event)', '(keydown.arrowLeft)': 'onKeyDown($event)' },
})
export class UiTabsComponent {
  onKeyDown(event: Event) {
    const keyboard = event as KeyboardEvent;
    const tabs = (event.target as HTMLElement)
      .closest('[role="tablist"]')
      ?.querySelectorAll<HTMLElement>('[role="tab"]');
    if (!tabs?.length) return;
    const idx = Array.from(tabs).indexOf(event.target as HTMLElement);
    const next =
      keyboard.key === 'ArrowRight'
        ? (idx + 1) % tabs.length
        : (idx - 1 + tabs.length) % tabs.length;
    tabs[next].focus();
    tabs[next].click();
  }
}

@Component({
  selector: 'ui-tab',
  template: `
    <button
      role="tab"
      [class]="
        'px-4 py-2 text-body font-medium -mb-px transition-colors duration-fast' +
        (active()
          ? ' text-text-primary border-b-2 border-primary'
          : ' text-text-secondary hover:text-text-primary border-b-2 border-transparent')
      "
      [attr.aria-selected]="active()"
    >
      <ng-content />
    </button>
  `,
  standalone: true,
})
export class UiTabComponent {
  active = input(false);
}
