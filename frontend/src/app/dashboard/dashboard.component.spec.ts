import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { expectAccessible } from '../../testing/a11y';

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardComponent);
  });

  it('should render the dashboard heading', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toBe('Dashboard');
  });

  it('should be accessible', async () => {
    fixture.detectChanges();
    await expectAccessible(fixture.nativeElement as HTMLElement);
  });
});
