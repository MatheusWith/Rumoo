import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiSelectComponent } from './select.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({
  template: '<ui-select><option>Opt A</option></ui-select>',
  imports: [UiSelectComponent],
})
class Host {}

describe('UiSelectComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('renders a select', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('select')).toBeTruthy();
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
