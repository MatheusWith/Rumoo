import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-skeleton',
  template: `<div [class]="'w-full h-4 bg-border rounded animate-pulse'" aria-hidden="true"></div>`,
  standalone: true,
})
export class UiSkeletonComponent {
  width = input('100%');
  height = input('1rem');
}
