import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTransactionComponent } from './update-transaction.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
    component.uncategorizedTransactions = [
      {
        id: '1',
        account_id: 'acc',
        posted: 123,
        amount: '12.12',
        description: 'description',
        payee: 'Amazon',
        memo: '',
        transacted_at: 123,
        category: 'Food & Dining',
      },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should call onSubmit and emit close', async () => {
    spyOn(component.close, 'emit');
    spyOn(component.updateTxnsForm, 'reset');

    // Mock the form validity
    component.updateTxnsForm = new FormGroup({
      mockField: new FormControl('value', Validators.required),
    });

    await component.onSubmit();

    expect(component.close.emit).toHaveBeenCalled();
    expect(component.updateTxnsForm.reset).toHaveBeenCalled();
  });
});
