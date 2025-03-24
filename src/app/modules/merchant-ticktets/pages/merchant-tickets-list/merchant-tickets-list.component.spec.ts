/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MerchantTicketsListComponent } from './merchant-tickets-list.component';

describe('MerchantTicketsListComponent', () => {
  let component: MerchantTicketsListComponent;
  let fixture: ComponentFixture<MerchantTicketsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MerchantTicketsListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantTicketsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
