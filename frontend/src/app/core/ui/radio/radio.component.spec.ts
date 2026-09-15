import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiRadioComponent } from './radio.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({ template: '<ui-radio>Option A</ui-radio>', imports: [UiRadioComponent] })
class Host {}

describe('UiRadioComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('renders with label', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input[type="radio"]')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Option A');
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
