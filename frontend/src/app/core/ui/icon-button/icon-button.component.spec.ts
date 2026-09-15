import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiIconButtonComponent } from './icon-button.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({
  template: `<ui-icon-button icon="lucide-bell" label="Notifications" />`,
  imports: [UiIconButtonComponent],
})
class Host {}

describe('UiIconButtonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('renders button with icon', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).toBeTruthy();
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
