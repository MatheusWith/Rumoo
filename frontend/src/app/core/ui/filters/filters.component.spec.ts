import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiFiltersComponent, UiFilterChipComponent } from './filters.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({
  template: `<ui-filters [activeCount]="1"><ui-filter-chip>Status</ui-filter-chip></ui-filters>`,
  imports: [UiFiltersComponent, UiFilterChipComponent],
})
class Host {}

describe('UiFiltersComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('shows the active count', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('1');
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
