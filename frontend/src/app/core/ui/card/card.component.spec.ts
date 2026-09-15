import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiCardComponent } from './card.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({ template: '<ui-card title="Card Title">Body</ui-card>', imports: [UiCardComponent] })
class Host {}

describe('UiCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('renders title and content', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h3')?.textContent).toBe('Card Title');
    expect(fixture.nativeElement.textContent).toContain('Body');
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
