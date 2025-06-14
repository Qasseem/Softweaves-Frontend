/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ItemsWithoutSerialWarehouseHistoryComponent } from './items-without-serial-warehouse-history.component';

describe('ItemsWithoutSerialWarehouseHistoryComponent', () => {
  let component: ItemsWithoutSerialWarehouseHistoryComponent;
  let fixture: ComponentFixture<ItemsWithoutSerialWarehouseHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemsWithoutSerialWarehouseHistoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ItemsWithoutSerialWarehouseHistoryComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
