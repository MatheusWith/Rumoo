import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiAvatarComponent } from './avatar.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({ template: `<ui-avatar name="Alice Alves" />`, imports: [UiAvatarComponent] })
class HostAlone {}

@Component({
  template: `<ui-avatar name="Alice Alves" [online]="true" />`,
  imports: [UiAvatarComponent],
})
class HostOnline {}

describe('UiAvatarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('shows initials', () => {
    const fixture = TestBed.createComponent(HostAlone);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('AA');
  });

  it('renders an online dot when online', () => {
    const fixture = TestBed.createComponent(HostOnline);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.bg-success-solid')).toBeTruthy();
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(HostOnline);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
