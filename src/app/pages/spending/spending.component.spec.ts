import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingComponent } from './spending.component';
import { provideHttpClient, withFetch } from '@angular/common/http';

describe('SpendingComponent', () => {
  let component: SpendingComponent;
  let fixture: ComponentFixture<SpendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpendingComponent],
      providers: [provideHttpClient(withFetch())],
    }).compileComponents();

    fixture = TestBed.createComponent(SpendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle toggleDialog', () => {
    component.toggleDialog();
    expect(component.isDialogOpen).toBeTruthy();
  });

  it('should handleDialogClose', () => {
    component.handleDialogClose();
    expect(component.isDialogOpen).toBeFalsy();
  });

  it('should handle onMonthSelected', () => {
    component.onMonthSelected('Nov');
    expect(component.currentMonth).toBe('Nov');
  });
});
