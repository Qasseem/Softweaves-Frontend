/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ItemsWithoutSerialEmployeeHistoryComponent } from './items-without-serial-employee-history.component';

describe('ItemsWithoutSerialEmployeeHistoryComponent', () => {
  let component: ItemsWithoutSerialEmployeeHistoryComponent;
  let fixture: ComponentFixture<ItemsWithoutSerialEmployeeHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemsWithoutSerialEmployeeHistoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ItemsWithoutSerialEmployeeHistoryComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
