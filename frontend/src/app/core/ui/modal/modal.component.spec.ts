import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiModalComponent } from './modal.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({
  template: '<ui-modal title="Confirm">Are you sure?</ui-modal>',
  imports: [UiModalComponent],
})
class Host {}

describe('UiModalComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('opens and renders title + content', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
    dialog.showModal();
    expect(dialog.querySelector('h2')?.textContent).toBe('Confirm');
    expect(dialog.textContent).toContain('Are you sure?');
    dialog.close();
  });

  it('passes WCAG AA axe when open', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
    dialog.showModal();
    await expectAccessible(fixture.nativeElement as HTMLElement);
    dialog.close();
  });
});
