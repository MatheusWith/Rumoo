import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiListComponent, UiListRowComponent } from './list.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({
  template: `<ul ui-list>
    <li ui-list-row>Item</li>
  </ul>`,
  imports: [UiListComponent, UiListRowComponent],
})
class Host {}

describe('UiListComponent / UiListRowComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('renders a semantic list', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('ul')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('li')?.textContent).toBe('Item');
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
