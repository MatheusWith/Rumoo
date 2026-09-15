import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiContextMenuComponent } from './context-menu.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({
  template: `<ui-context-menu>
    <span item-1>Rename</span><span item-2>Delete</span>
  </ui-context-menu>`,
  imports: [UiContextMenuComponent],
})
class Host {}

describe('UiContextMenuComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('renders menu with two items', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('[role="menuitem"]').length).toBe(2);
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
