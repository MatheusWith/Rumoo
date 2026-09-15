import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiButtonComponent } from './button.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({ template: '<ui-button>Label</ui-button>', imports: [UiButtonComponent] })
class DefaultHost {}

@Component({
  template: `<ui-button [variant]="'danger'">Danger</ui-button>`,
  imports: [UiButtonComponent],
})
class DangerHost {}

@Component({
  template: `<ui-button [disabled]="true">Disabled</ui-button>`,
  imports: [UiButtonComponent],
})
class DisabledHost {}

describe('UiButtonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('renders the projected label', () => {
    const fixture = TestBed.createComponent(DefaultHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('Label');
  });

  it('applies variant classes', () => {
    const fixture = TestBed.createComponent(DangerHost);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button') as HTMLElement;
    expect(btn.className).toContain('bg-danger-solid');
  });

  it('disables correctly', () => {
    const fixture = TestBed.createComponent(DisabledHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')?.disabled).toBeTrue();
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
