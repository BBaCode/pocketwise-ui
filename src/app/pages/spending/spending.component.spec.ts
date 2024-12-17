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
});
