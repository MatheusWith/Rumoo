import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiEmptyStateComponent } from './empty-state.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({
  template: '<ui-empty-state title="No items" message="Create one" />',
  imports: [UiEmptyStateComponent],
})
class Host {}

describe('UiEmptyStateComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('renders title and message', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No items');
    expect(fixture.nativeElement.textContent).toContain('Create one');
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
