import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiInputComponent } from './input.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({ template: '<ui-input placeholder="Enter" />', imports: [UiInputComponent] })
class Host {}

describe('UiInputComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('renders with placeholder', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input')?.placeholder).toBe('Enter');
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
