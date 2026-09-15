import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiToggleComponent } from './toggle.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({
  template: `<ui-toggle label="Dark mode" [checked]="false" />`,
  imports: [UiToggleComponent],
})
class OffHost {}

@Component({
  template: `<ui-toggle label="Dark mode" [checked]="true" />`,
  imports: [UiToggleComponent],
})
class OnHost {}

describe('UiToggleComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('renders with switch role', () => {
    const fixture = TestBed.createComponent(OffHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="switch"]')).toBeTruthy();
  });

  it('keeps the knob symmetrically inset when off (4px from the left edge)', () => {
    const fixture = TestBed.createComponent(OffHost);
    fixture.detectChanges();
    const track = fixture.nativeElement.querySelector('button') as HTMLElement;
    const knob = fixture.nativeElement.querySelector('span') as HTMLElement;
    const trect = track.getBoundingClientRect();
    const krect = knob.getBoundingClientRect();
    expect(Math.abs(krect.left - trect.left - 4)).toBeLessThanOrEqual(1);
  });

  it('pushes the knob to the far right when on (4px from the right edge)', () => {
    const fixture = TestBed.createComponent(OnHost);
    fixture.detectChanges();
    const track = fixture.nativeElement.querySelector('button') as HTMLElement;
    const knob = fixture.nativeElement.querySelector('span') as HTMLElement;
    const trect = track.getBoundingClientRect();
    const krect = knob.getBoundingClientRect();
    expect(Math.abs(trect.right - krect.right - 4)).toBeLessThanOrEqual(1);
  });

  it('passes WCAG AA axe', async () => {
    for (const host of [OffHost, OnHost]) {
      const fixture = TestBed.createComponent(host);
      fixture.detectChanges();
      await expectAccessible(fixture.nativeElement as HTMLElement);
    }
  });
});
