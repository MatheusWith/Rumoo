import { Component, input, output } from '@angular/core';

@Component({
  selector: 'ui-toggle',
  template: `
    <button
      type="button"
      role="switch"
      [attr.aria-label]="label()"
      [attr.aria-checked]="checked()"
      (click)="toggled.emit(!checked())"
      [disabled]="disabled()"
      [class]="
        'relative inline-flex items-center h-5 w-9 rounded-full transition-colors duration-fast
         focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent
         disabled:opacity-50 disabled:cursor-not-allowed' +
        (checked() ? ' bg-primary' : ' bg-border')
      "
    >
      <span
        class="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow ring-0 transition-transform duration-fast"
        [class.translate-x-4]="checked()"
        [class.translate-x-1]="!checked()"
      ></span>
    </button>
  `,
  standalone: true,
})
export class UiToggleComponent {
  checked = input(false);
  label = input('');
  disabled = input(false);
  toggled = output<boolean>();
}
