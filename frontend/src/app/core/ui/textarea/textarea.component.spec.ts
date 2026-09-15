import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiTextareaComponent } from './textarea.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({ template: '<ui-textarea placeholder="Write" />', imports: [UiTextareaComponent] })
class Host {}

describe('UiTextareaComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('renders a textarea', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('textarea')?.placeholder).toBe('Write');
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
