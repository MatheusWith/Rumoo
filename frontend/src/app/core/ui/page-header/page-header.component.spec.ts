import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiPageHeaderComponent } from './page-header.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({
  template: `<ui-page-header title="Goals" subtitle="Strategic objectives for Q3">
    <button page-actions>New goal</button>
  </ui-page-header>`,
  imports: [UiPageHeaderComponent],
})
class Host {}

describe('UiPageHeaderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('renders the title, subtitle and actions', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toBe('Goals');
    expect(el.textContent).toContain('Strategic objectives for Q3');
    expect(el.textContent).toContain('New goal');
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
