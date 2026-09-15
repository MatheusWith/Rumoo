import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-avatar',
  template: `
    <span
      class="inline-flex items-center justify-center rounded-full bg-secondary-subtle text-secondary font-medium select-none"
      [class]="size() === 32 ? 'h-8 w-8 text-body-s' : 'h-6 w-6 text-caption'"
      [attr.aria-label]="name()"
    >
      {{ initials() }}
      @if (online()) {
        <span
          class="relative -ml-1.5 -mb-1.5 h-2 w-2 rounded-full bg-success-solid border-2 border-surface self-end"
        ></span>
      }
    </span>
  `,
  standalone: true,
})
export class UiAvatarComponent {
  name = input('');
  online = input(false);
  size = input<24 | 32>(24);

  initials(): string {
    return this.name()
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
