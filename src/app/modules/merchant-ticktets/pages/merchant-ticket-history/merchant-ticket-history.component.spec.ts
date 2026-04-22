/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MerchantTicketHistoryComponent } from './merchant-ticket-history.component';

describe('MerchantTicketHistoryComponent', () => {
  let component: MerchantTicketHistoryComponent;
  let fixture: ComponentFixture<MerchantTicketHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MerchantTicketHistoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantTicketHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
