import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiDropdownComponent, UiMenuItemComponent } from './dropdown.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({
  template: `<ui-dropdown [open]="true">
    <span dropdown-trigger>Actions</span>
    <div dropdown-items><ui-menu-item>Edit</ui-menu-item></div>
  </ui-dropdown>`,
  imports: [UiDropdownComponent, UiMenuItemComponent],
})
class Host {}

describe('UiDropdownComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('renders trigger and menu', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[role="menu"]')).toBeTruthy();
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
