import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiTabsComponent, UiTabComponent } from './tabs.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({
  template: `<ui-tabs><ui-tab>Tab A</ui-tab><ui-tab>Tab B</ui-tab></ui-tabs>`,
  imports: [UiTabsComponent, UiTabComponent],
})
class Host {}

describe('UiTabsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('renders tabs with tablist role', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="tablist"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('[role="tab"]').length).toBe(2);
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
