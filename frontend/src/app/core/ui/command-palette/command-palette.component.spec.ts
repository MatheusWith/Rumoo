import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiCommandPaletteComponent } from './command-palette.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({ template: `<ui-command-palette />`, imports: [UiCommandPaletteComponent] })
class Host {}

describe('UiCommandPaletteComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('renders a labelled trigger', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn).toBeTruthy();
    expect(btn.getAttribute('aria-label')).toBe('Open command palette');
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
