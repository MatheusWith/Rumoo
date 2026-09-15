import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-progress',
  template: `
    <div
      class="flex items-center w-full"
      role="progressbar"
      [attr.aria-label]="label()"
      [attr.aria-valuenow]="value()"
      [attr.aria-valuemax]="100"
    >
      <div class="bg-border h-1.5 rounded-full overflow-hidden w-full">
        <div
          class="bg-primary h-full rounded-full transition-[width] duration-slow ease-out"
          [style.width.%]="value()"
        ></div>
      </div>
      <span class="text-body-s text-text-secondary ml-2 font-medium tabular-nums"
        >{{ value() }}%</span
      >
    </div>
  `,
  standalone: true,
})
export class UiProgressComponent {
  value = input(0);
  label = input('');
}

@Component({
  selector: 'ui-progress-ring',
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 32 32"
      class="transform -rotate-90"
      role="progressbar"
      [attr.aria-label]="label()"
      [attr.aria-valuenow]="value()"
      [attr.aria-valuemax]="100"
    >
      <circle
        cx="16"
        cy="16"
        r="14"
        fill="none"
        stroke="var(--color-border)"
        stroke-width="4"
      ></circle>
      <circle
        cx="16"
        cy="16"
        r="14"
        fill="none"
        stroke="var(--color-primary)"
        stroke-width="4"
        stroke-linecap="round"
        [style.stroke-dasharray]="circumference"
        [style.stroke-dashoffset]="offset"
        class="transition-[stroke-dashoffset] duration-slow ease-out"
      ></circle>
    </svg>
  `,
  standalone: true,
})
export class UiProgressRingComponent {
  value = input(0);
  size = input(32);
  label = input('');

  circumference = 2 * Math.PI * 14;

  get offset(): number {
    return this.circumference * (1 - this.value() / 100);
  }
}
