import { Component, input, output, viewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'ui-modal',
  template: `
    <dialog #dialogEl [class]="fullClass()" (close)="closed.emit()">
      @if (title()) {
        <header class="flex items-center justify-between px-5 pt-5 pb-2">
          <h2 class="text-heading-m font-semibold text-text-primary">{{ title() }}</h2>
          <button
            type="button"
            class="text-text-tertiary hover:text-icon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent"
            (click)="close()"
            aria-label="Close"
          >
            &times;
          </button>
        </header>
      }
      <div class="px-5 pb-5 pt-2 text-body text-text-primary">
        <ng-content />
      </div>
    </dialog>
  `,
  standalone: true,
})
export class UiModalComponent {
  title = input('');
  /** sm ≈ 384px (confirm), md ≈ 448px (default), lg ≈ 672px (large forms/details). */
  size = input<'sm' | 'md' | 'lg'>('md');
  dialogEl = viewChild<ElementRef<HTMLDialogElement>>('dialogEl');
  closed = output<void>();

  widthClass(): string {
    const widths: Record<string, string> = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-2xl',
    };
    return widths[this.size()];
  }

  fullClass(): string {
    return `backdrop:bg-overlay bg-surface rounded-lg shadow-lg p-0 border border-border w-full ${this.widthClass()}`;
  }

  open() {
    this.dialogEl()?.nativeElement.showModal();
  }

  close() {
    this.dialogEl()?.nativeElement.close();
  }
}
