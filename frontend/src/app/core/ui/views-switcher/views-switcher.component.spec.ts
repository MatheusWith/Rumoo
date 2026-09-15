import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiViewsSwitcherComponent } from './views-switcher.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({
  template: `<ui-views-switcher active="Board" />`,
  imports: [UiViewsSwitcherComponent],
})
class Host {}

describe('UiViewsSwitcherComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('renders three radios', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('[role="radio"]').length).toBe(3);
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
