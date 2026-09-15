import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { expectAccessible } from '../../../../testing/a11y';

@Component({
  selector: 'app-token-smoke',
  standalone: true,
  template: `
    <div class="bg-surface p-4">
      <button type="button" class="bg-primary text-on-primary px-4 py-2 rounded-lg">
        Token smoke button
      </button>
      <p class="text-text-primary">Primary text on surface</p>
      <p class="text-text-secondary">Secondary text on surface</p>
    </div>
  `,
})
class TokenSmokeComponent {}

describe('design tokens', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenSmokeComponent],
    }).compileComponents();
  });

  it('resolves semantic Tailwind utilities from @theme', () => {
    const fixture = TestBed.createComponent(TokenSmokeComponent);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLElement;
    const primary = getComputedStyle(button).backgroundColor;
    expect(primary).toBe('rgb(4, 120, 87)'); // --color-primary light #047857
  });

  it('switches the primary color when the dark theme attribute is set', () => {
    const root = document.documentElement;
    root.dataset['theme'] = 'dark';
    try {
      const fixture = TestBed.createComponent(TokenSmokeComponent);
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button') as HTMLElement;
      expect(getComputedStyle(button).backgroundColor).toBe('rgb(52, 211, 153)'); // dark #34d399
    } finally {
      delete root.dataset['theme'];
    }
  });

  it('passes WCAG AA contrast for the documented token pairings', async () => {
    const fixture = TestBed.createComponent(TokenSmokeComponent);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
