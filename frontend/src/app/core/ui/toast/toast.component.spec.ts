import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiToastComponent } from './toast.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({ template: '<ui-toast>Success!</ui-toast>', imports: [UiToastComponent] })
class SuccessHost {}

@Component({ template: '<ui-toast variant="error">Error!</ui-toast>', imports: [UiToastComponent] })
class ErrorHost {}

describe('UiToastComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('renders and has status role', () => {
    const fixture = TestBed.createComponent(SuccessHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Success!');
    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeTruthy();
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(ErrorHost);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
