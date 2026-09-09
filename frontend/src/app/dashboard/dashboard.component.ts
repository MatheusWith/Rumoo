import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `<h1 class="text-xl font-bold text-gray-800">Dashboard</h1>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {}
