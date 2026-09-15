import { Component, input, output, viewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'ui-modal',
  template: `
    <dialog
      #dialogEl
      class="backdrop:bg-overlay bg-surface rounded-lg shadow-lg max-w-md w-full p-0 border border-border"
      (close)="closed.emit()"
    >
      @if (title()) {
        <header class="flex items-center justify-between px-5 pt-5 pb-2">
          <h2 class="text-heading-m font-semibold text-text-primary">{{ title() }}</h2>
          <button
            type="button"
            class="text-text-tertiary hover:text-icon"
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
  dialogEl = viewChild<ElementRef<HTMLDialogElement>>('dialogEl');
  closed = output<void>();

  open() {
    this.dialogEl()?.nativeElement.showModal();
  }

  close() {
    this.dialogEl()?.nativeElement.close();
  }
}
