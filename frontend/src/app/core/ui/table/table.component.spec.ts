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
class DefaultHost {}

@Component({
  template: `<ui-table [striped]="true">
    <ui-table-head><ui-th>Name</ui-th></ui-table-head>
    <ui-table-body
      ><ui-table-row><ui-td>Alice</ui-td></ui-table-row></ui-table-body
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
class StripedHost {}

@Component({
  template: `<ui-table [bordered]="true">
    <ui-table-head><ui-th>Name</ui-th></ui-table-head>
    <ui-table-body
      ><ui-table-row><ui-td>Alice</ui-td></ui-table-row></ui-table-body
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
class BorderedHost {}

describe('UiTableComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
    delete document.documentElement.dataset['density'];
  });

  afterEach(() => {
    delete document.documentElement.dataset['density'];
  });

  it('renders table with header and row', () => {
    const fixture = TestBed.createComponent(DefaultHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('table')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('th').length).toBe(2);
    expect(fixture.nativeElement.querySelectorAll('td').length).toBe(2);
  });

  it('applies the striped class when striped input is set', () => {
    const fixture = TestBed.createComponent(StripedHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('table').classList).toContain('ui-table-striped');
  });

  it('applies the bordered class when bordered input is set', () => {
    const fixture = TestBed.createComponent(BorderedHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('table').classList).toContain('ui-table-bordered');
  });

  it('compacts cell padding when the root density is compact', () => {
    document.documentElement.dataset['density'] = 'compact';
    const fixture = TestBed.createComponent(DefaultHost);
    fixture.detectChanges();
    const td = fixture.nativeElement.querySelector('td') as HTMLElement;
    expect(td.className).toContain('ui-compact:py-1');
  });

  it('passes WCAG AA axe for all variants', async () => {
    for (const host of [DefaultHost, StripedHost, BorderedHost]) {
      const fixture = TestBed.createComponent(host);
      fixture.detectChanges();
      await expectAccessible(fixture.nativeElement as HTMLElement);
    }
  });
});
