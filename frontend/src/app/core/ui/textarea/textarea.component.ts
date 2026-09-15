import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-textarea',
  template: `
    @if (label()) {
      <label class="sr-only" for="ui-textarea-{{ label() }}">{{ label() }}</label>
    }
    <textarea
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [attr.aria-label]="label() ? null : placeholder()"
      [class]="'w-full rounded-md border bg-field px-3 ui-compact:px-2 py-2 ui-compact:py-1 text-body text-text-primary
         placeholder:text-text-tertiary border-border resize-y
         focus:outline-none focus:ring-2 focus:ring-primary-accent
         disabled:opacity-50 disabled:bg-background disabled:cursor-not-allowed'"
    ></textarea>
  `,
  standalone: true,
})
export class UiTextareaComponent {
  label = input('');
  placeholder = input('');
  disabled = input(false);
}
