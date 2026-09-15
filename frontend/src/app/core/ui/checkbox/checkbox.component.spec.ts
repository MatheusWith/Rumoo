import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiCheckboxComponent } from './checkbox.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({ template: '<ui-checkbox>Accept</ui-checkbox>', imports: [UiCheckboxComponent] })
class Host {}

describe('UiCheckboxComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('renders with label', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input[type="checkbox"]')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Accept');
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
