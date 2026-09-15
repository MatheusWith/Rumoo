import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  UiTableComponent,
  UiTableHeadComponent,
  UiTableBodyComponent,
  UiTableRowComponent,
  UiThComponent,
  UiTdComponent,
} from './table.component';
import { expectAccessible } from '../../../../testing/a11y';

@Component({
  template: `<ui-table>
    <ui-table-head><ui-th>Name</ui-th><ui-th>Role</ui-th></ui-table-head>
    <ui-table-body
      ><ui-table-row><ui-td>Alice</ui-td><ui-td>Admin</ui-td></ui-table-row></ui-table-body
    >
  </ui-table>`,
  imports: [
    UiTableComponent,
    UiTableHeadComponent,
    UiTableBodyComponent,
    UiTableRowComponent,
    UiThComponent,
    UiTdComponent,
  ],
})
class Host {}

describe('UiTableComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('renders table with header and row', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('table')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('th').length).toBe(2);
    expect(fixture.nativeElement.querySelectorAll('td').length).toBe(2);
  });

  it('passes WCAG AA axe', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
