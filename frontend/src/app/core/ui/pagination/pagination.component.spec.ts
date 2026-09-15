import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiPaginationComponent } from './pagination.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({
  template: `<ui-pagination [page]="2" [total]="10" />`,
  imports: [UiPaginationComponent],
})
class Host {}

describe('UiPaginationComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('shows current page and total', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Page 2 of 10');
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
