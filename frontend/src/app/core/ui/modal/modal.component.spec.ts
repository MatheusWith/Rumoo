import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UiModalComponent } from './modal.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({
  template: '<ui-modal title="Confirm">Are you sure?</ui-modal>',
  imports: [UiModalComponent],
})
class DefaultHost {}

@Component({
  template: '<ui-modal size="sm" title="Delete">Delete this?</ui-modal>',
  imports: [UiModalComponent],
})
class SmallHost {}

@Component({
  template: '<ui-modal size="lg" title="Details">Large</ui-modal>',
  imports: [UiModalComponent],
})
class LargeHost {}

@Component({
  template: '<ui-modal position="top" title="Command">Top</ui-modal>',
  imports: [UiModalComponent],
})
class TopHost {}

@Component({
  template: '<ui-modal [modal]="false" title="Tip">Light</ui-modal>',
  imports: [UiModalComponent],
})
class NonModalHost {}

@Component({
  template: '<ui-modal [closeOnEsc]="false" title="Persist">Locked</ui-modal>',
  imports: [UiModalComponent],
})
class PersistentHost {}

function modalOf(fixture: ComponentFixture<unknown>): UiModalComponent {
  return fixture.debugElement.query(By.directive(UiModalComponent)).componentInstance;
}

describe('UiModalComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('opens via showModal and closes via close', () => {
    const fixture = TestBed.createComponent(DefaultHost);
    fixture.detectChanges();
    const modal = modalOf(fixture);
    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
    modal.open();
    expect(dialog.open).toBeTrue();
    expect(dialog.matches(':modal')).toBeTrue();
    modal.close();
    expect(dialog.open).toBeFalse();
  });

  it('opens as a non-modal dialog (background interactive) when modal=false', () => {
    const fixture = TestBed.createComponent(NonModalHost);
    fixture.detectChanges();
    const modal = modalOf(fixture);
    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
    modal.open();
    expect(dialog.open).toBeTrue();
    expect(dialog.matches(':modal')).toBeFalse();
    modal.close();
  });

  it('anchors near the top when position="top"', () => {
    const fixture = TestBed.createComponent(TopHost);
    fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLElement;
    expect(dialog.className).toContain('mt-16');
    expect(dialog.className).toContain('mx-auto');
  });

  it('keeps the dialog open when Esc is pressed and closeOnEsc=false', () => {
    const fixture = TestBed.createComponent(PersistentHost);
    fixture.detectChanges();
    const modal = modalOf(fixture);
    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
    modal.open();
    const cancel = new Event('cancel', { cancelable: true });
    dialog.dispatchEvent(cancel);
    expect(cancel.defaultPrevented).toBeTrue();
    expect(dialog.open).toBeTrue();
    modal.close();
  });

  it('applies the sm width for the confirm size', () => {
    const fixture = TestBed.createComponent(SmallHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('dialog')?.className).toContain('max-w-sm');
  });

  it('applies the lg width for the large size', () => {
    const fixture = TestBed.createComponent(LargeHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('dialog')?.className).toContain('max-w-2xl');
  });

  it('passes WCAG AA axe when open', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    fixture.detectChanges();
    const modal = modalOf(fixture);
    modal.open();
    await expectAccessible(fixture.nativeElement as HTMLElement);
    modal.close();
  });
});
