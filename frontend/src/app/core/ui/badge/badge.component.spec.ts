import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiBadgeComponent } from './badge.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({ template: '<ui-badge label="role">Member</ui-badge>', imports: [UiBadgeComponent] })
class Host {}

@Component({
  template: '<ui-badge variant="success" label="status">Active</ui-badge>',
  imports: [UiBadgeComponent],
})
class VariantHost {}

describe('UiBadgeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('renders label', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Member');
  });

  it('applies variant class', () => {
    const fixture = TestBed.createComponent(VariantHost);
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('span')?.parentElement as HTMLElement;
    expect(badge.className).toContain('bg-success-subtle');
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
