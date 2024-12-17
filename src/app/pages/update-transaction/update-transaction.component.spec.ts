import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTransactionComponent } from './update-transaction.component';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('UpdateTransactionComponent', () => {
  let component: UpdateTransactionComponent;
  let fixture: ComponentFixture<UpdateTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTransactionComponent],
      providers: [HttpClient, HttpHandler],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
