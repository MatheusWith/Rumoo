import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiGroupRoleBadgeComponent } from './group-role-badge.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({
  template: `<ui-group-role-badge kind="leader" />`,
  imports: [UiGroupRoleBadgeComponent],
})
class HostLeader {}

@Component({
  template: `<ui-group-role-badge kind="member" />`,
  imports: [UiGroupRoleBadgeComponent],
})
class HostMember {}

describe('UiGroupRoleBadgeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('renders Leader label for leader kind', () => {
    const fixture = TestBed.createComponent(HostLeader);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Leader');
  });

  it('renders Member label for member kind', () => {
    const fixture = TestBed.createComponent(HostMember);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Member');
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(HostLeader);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
