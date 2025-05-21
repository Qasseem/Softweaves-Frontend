/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TransferCustodyListComponent } from './transfer-custody-list.component';

describe('TransferCustodyListComponent', () => {
  let component: TransferCustodyListComponent;
  let fixture: ComponentFixture<TransferCustodyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TransferCustodyListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferCustodyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
