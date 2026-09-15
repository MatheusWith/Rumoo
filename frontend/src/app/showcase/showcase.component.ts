import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiButtonComponent } from '../core/ui/button/button.component';
import { UiIconButtonComponent } from '../core/ui/icon-button/icon-button.component';
import { UiInputComponent } from '../core/ui/input/input.component';
import { UiTextareaComponent } from '../core/ui/textarea/textarea.component';
import { UiSelectComponent } from '../core/ui/select/select.component';
import { UiCheckboxComponent } from '../core/ui/checkbox/checkbox.component';
import { UiRadioComponent } from '../core/ui/radio/radio.component';
import { UiToggleComponent } from '../core/ui/toggle/toggle.component';
import { UiSearchComponent } from '../core/ui/search/search.component';
import { UiCardComponent } from '../core/ui/card/card.component';
import { UiListComponent, UiListRowComponent } from '../core/ui/list/list.component';
import {
  UiTableComponent,
  UiTableHeadComponent,
  UiTableBodyComponent,
  UiTableRowComponent,
  UiThComponent,
  UiTdComponent,
} from '../core/ui/table/table.component';
import { UiModalComponent } from '../core/ui/modal/modal.component';
import { UiToastComponent } from '../core/ui/toast/toast.component';
import { UiBannerComponent } from '../core/ui/banner/banner.component';
import { UiEmptyStateComponent } from '../core/ui/empty-state/empty-state.component';
import { UiSkeletonComponent } from '../core/ui/skeleton/skeleton.component';
import {
  UiProgressComponent,
  UiProgressRingComponent,
} from '../core/ui/progress/progress.component';
import { UiBadgeComponent } from '../core/ui/badge/badge.component';
import { UiGroupRoleBadgeComponent } from '../core/ui/badge/group-role-badge.component';
import { UiTooltipComponent } from '../core/ui/tooltip/tooltip.component';
import { UiTabsComponent, UiTabComponent } from '../core/ui/tabs/tabs.component';
import { UiDropdownComponent, UiMenuItemComponent } from '../core/ui/dropdown/dropdown.component';
import { UiContextMenuComponent } from '../core/ui/context-menu/context-menu.component';
import { UiPaginationComponent } from '../core/ui/pagination/pagination.component';
import { UiFiltersComponent, UiFilterChipComponent } from '../core/ui/filters/filters.component';
import { UiViewsSwitcherComponent } from '../core/ui/views-switcher/views-switcher.component';
import { UiCommandPaletteComponent } from '../core/ui/command-palette/command-palette.component';
import { UiAvatarComponent } from '../core/ui/avatar/avatar.component';
import { DemoSectionComponent } from './demo-section.component';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  standalone: true,
  imports: [
    RouterLink,
    DemoSectionComponent,
    UiButtonComponent,
    UiIconButtonComponent,
    UiInputComponent,
    UiTextareaComponent,
    UiSelectComponent,
    UiCheckboxComponent,
    UiRadioComponent,
    UiToggleComponent,
    UiSearchComponent,
    UiCardComponent,
    UiListComponent,
    UiListRowComponent,
    UiTableComponent,
    UiTableHeadComponent,
    UiTableBodyComponent,
    UiTableRowComponent,
    UiThComponent,
    UiTdComponent,
    UiModalComponent,
    UiToastComponent,
    UiBannerComponent,
    UiEmptyStateComponent,
    UiSkeletonComponent,
    UiProgressComponent,
    UiProgressRingComponent,
    UiBadgeComponent,
    UiGroupRoleBadgeComponent,
    UiTooltipComponent,
    UiTabsComponent,
    UiTabComponent,
    UiDropdownComponent,
    UiMenuItemComponent,
    UiContextMenuComponent,
    UiPaginationComponent,
    UiFiltersComponent,
    UiFilterChipComponent,
    UiViewsSwitcherComponent,
    UiCommandPaletteComponent,
    UiAvatarComponent,
  ],
})
export class ShowcaseComponent {
  theme = signal<'light' | 'dark'>('light');
  density = signal<'comfortable' | 'compact'>('comfortable');

  setTheme(theme: 'light' | 'dark') {
    this.theme.set(theme);
    document.documentElement.dataset['theme'] = theme;
  }

  setDensity(density: 'comfortable' | 'compact') {
    this.density.set(density);
    document.documentElement.dataset['density'] = density;
  }
}
