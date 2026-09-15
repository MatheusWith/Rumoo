import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-input',
  template: `
    @if (label()) {
      <label class="sr-only" for="ui-input-{{ label() }}">{{ label() }}</label>
    }
    <input
      [type]="type()"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [attr.aria-label]="label() ? null : placeholder()"
      [class]="'w-full rounded-md border bg-field px-3 py-2 text-body text-text-primary
         placeholder:text-text-tertiary border-border
         focus:outline-none focus:ring-2 focus:ring-primary-accent
         disabled:opacity-50 disabled:bg-background disabled:cursor-not-allowed'"
    />
  `,
  standalone: true,
})
export class UiInputComponent {
  label = input('');
  type = input('text');
  placeholder = input('');
  disabled = input(false);
}
