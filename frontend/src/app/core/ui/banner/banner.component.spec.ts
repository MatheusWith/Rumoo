import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiBannerComponent } from './banner.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({
  template: '<ui-banner variant="warning">Warning text</ui-banner>',
  imports: [UiBannerComponent],
})
class Host {}

describe('UiBannerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('renders the message', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Warning text');
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
