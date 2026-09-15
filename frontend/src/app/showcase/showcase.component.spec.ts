import { provideRouter } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import {
  lucideAlertCircle,
  lucideAlertTriangle,
  lucideBell,
  lucideCheckCircle2,
  lucideChevronDown,
  lucideChevronLeft,
  lucideChevronRight,
  lucideInbox,
  lucideInfo,
  lucideLoader2,
  lucideMoreVertical,
  lucideSearch,
  lucideSettings,
  lucideStar,
  lucideUser,
  lucideX,
} from '@ng-icons/lucide';
import { TestBed } from '@angular/core/testing';
import { ShowcaseComponent } from './showcase.component';
import { expectAccessible } from '../../testing/a11y';

describe('ShowcaseComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideIcons({
          lucideAlertCircle,
          lucideAlertTriangle,
          lucideBell,
          lucideCheckCircle2,
          lucideChevronDown,
          lucideChevronLeft,
          lucideChevronRight,
          lucideInbox,
          lucideInfo,
          lucideLoader2,
          lucideMoreVertical,
          lucideSearch,
          lucideSettings,
          lucideStar,
          lucideUser,
          lucideX,
        }),
      ],
    }).compileComponents();
  });

  it('renders the design system heading', () => {
    const fixture = TestBed.createComponent(ShowcaseComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Design System');
  });

  it('passes WCAG AA axe on the whole showcase', async () => {
    const fixture = TestBed.createComponent(ShowcaseComponent);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
