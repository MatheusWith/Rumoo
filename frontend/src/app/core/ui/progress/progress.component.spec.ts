import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiProgressComponent, UiProgressRingComponent } from './progress.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({
  template: `<ui-progress [value]="75" label="Progress" />`,
  imports: [UiProgressComponent],
})
class BarHost {}

@Component({
  template: `<ui-progress-ring [value]="60" label="Ring" />`,
  imports: [UiProgressRingComponent],
})
class RingHost {}

describe('UiProgressComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('renders with progressbar role', () => {
    const fixture = TestBed.createComponent(BarHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[role="progressbar"]');
    expect(el).toBeTruthy();
    expect(el.getAttribute('aria-valuenow')).toBe('75');
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(BarHost);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});

describe('UiProgressRingComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('renders SVG with progressbar', () => {
    const fixture = TestBed.createComponent(RingHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="progressbar"]')).toBeTruthy();
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(RingHost);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
