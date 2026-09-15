import { Component, input } from '@angular/core';
import { UiBadgeComponent } from './badge.component';

@Component({
  selector: 'ui-group-role-badge',
  template: `
    <ui-badge variant="primary" [icon]="kind() === 'leader' ? 'lucide-star' : 'lucide-user'">
      {{ kind() === 'leader' ? 'Leader' : 'Member' }}
    </ui-badge>
  `,
  standalone: true,
  imports: [UiBadgeComponent],
})
export class UiGroupRoleBadgeComponent {
  kind = input<'member' | 'leader'>('member');
}
