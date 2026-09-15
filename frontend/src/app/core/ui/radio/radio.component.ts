import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'ui-radio',
  template: `
    <label class="inline-flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        [checked]="checked()"
        (change)="checked.set(!checked())"
        [disabled]="disabled()"
        class="h-4 w-4 rounded-full border border-border text-primary focus:ring-2 focus:ring-primary-accent
               disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <span class="text-body text-text-primary"><ng-content /></span>
    </label>
  `,
  standalone: true,
})
export class UiRadioComponent {
  checked = signal(false);
  disabled = input(false);
}
