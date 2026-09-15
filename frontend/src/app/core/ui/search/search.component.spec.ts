import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiSearchComponent } from './search.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({ template: '<ui-search />', imports: [UiSearchComponent] })
class Host {}

describe('UiSearchComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('renders an input', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input')).toBeTruthy();
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
