import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
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

describe('UiModalComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('opens via showModal and closes via close', () => {
    const fixture = TestBed.createComponent(DefaultHost);
    fixture.detectChanges();
    const modal = fixture.debugElement.query(By.directive(UiModalComponent))
      .componentInstance as UiModalComponent;
    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
    modal.open();
    expect(dialog.open).toBeTrue();
    modal.close();
    expect(dialog.open).toBeFalse();
  });

  it('applies the sm width for the confirm size', () => {
    const fixture = TestBed.createComponent(SmallHost);
    fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLElement;
    expect(dialog.className).toContain('max-w-sm');
  });

  it('applies the lg width for the large size', () => {
    const fixture = TestBed.createComponent(LargeHost);
    fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLElement;
    expect(dialog.className).toContain('max-w-2xl');
  });

  it('passes WCAG AA axe when open', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    fixture.detectChanges();
    const modal = fixture.debugElement.query(By.directive(UiModalComponent))
      .componentInstance as UiModalComponent;
    modal.open();
    await expectAccessible(fixture.nativeElement as HTMLElement);
    modal.close();
  });
});
