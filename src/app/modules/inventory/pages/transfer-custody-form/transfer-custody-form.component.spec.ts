/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TransferCustodyFormComponent } from './transfer-custody-form.component';

describe('TransferCustodyFormComponent', () => {
  let component: TransferCustodyFormComponent;
  let fixture: ComponentFixture<TransferCustodyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TransferCustodyFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferCustodyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
