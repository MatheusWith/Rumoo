import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

@Component({
  selector: 'app-grid-smoke',
  standalone: true,
  template: `
    <div class="page-container" id="container">content</div>
    <div class="card-grid" id="cards">
      <div>a</div>
      <div>b</div>
    </div>
    <div class="card-grid-compact" id="compact"><div>a</div></div>
  `,
})
class GridSmokeComponent {}

describe('page grid utilities', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [GridSmokeComponent] }).compileComponents();
  });

  const styleOf = (fixture: { nativeElement: HTMLElement }, id: string) =>
    getComputedStyle(fixture.nativeElement.querySelector(`#${id}`) as HTMLElement);

  it('page-container caps the layout width at 1280px with lateral padding', () => {
    const fixture = TestBed.createComponent(GridSmokeComponent);
    fixture.detectChanges();
    const style = styleOf(fixture, 'container');
    expect(Math.round(parseFloat(style.maxWidth))).toBe(1280);
    expect(parseFloat(style.paddingInlineStart)).toBeGreaterThan(0);
  });

  it('card-grid renders as a grid with the documented 24px gutter', () => {
    const fixture = TestBed.createComponent(GridSmokeComponent);
    const style = styleOf(fixture, 'cards');
    expect(style.display).toBe('grid');
    expect(parseFloat(style.columnGap)).toBe(24);
  });

  it('card-grid-compact renders as a grid with the documented 16px gutter', () => {
    const fixture = TestBed.createComponent(GridSmokeComponent);
    const style = styleOf(fixture, 'compact');
    expect(style.display).toBe('grid');
    expect(parseFloat(style.columnGap)).toBe(16);
  });
});
