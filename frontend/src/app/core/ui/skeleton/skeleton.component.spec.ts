import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiSkeletonComponent } from './skeleton.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({ template: '<ui-skeleton />', imports: [UiSkeletonComponent] })
class Host {}

describe('UiSkeletonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('is marked as decorative', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
