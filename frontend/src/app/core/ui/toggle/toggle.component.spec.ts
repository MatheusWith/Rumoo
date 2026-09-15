import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiToggleComponent } from './toggle.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({ template: `<ui-toggle label="Dark mode" />`, imports: [UiToggleComponent] })
class Host {}

describe('UiToggleComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('renders with switch role', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="switch"]')).toBeTruthy();
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
