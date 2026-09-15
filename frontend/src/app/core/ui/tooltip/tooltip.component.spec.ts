import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiTooltipComponent } from './tooltip.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({
  template: '<ui-tooltip text="Help">Trigger</ui-tooltip>',
  imports: [UiTooltipComponent],
})
class Host {}

describe('UiTooltipComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('shows tooltip on mouseenter', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const wrapper = fixture.nativeElement.querySelector('[tabindex]');
    wrapper.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Help');
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
