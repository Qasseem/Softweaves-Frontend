/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ItemsWithoutSerialWarehouseComponent } from './items-without-serial-warehouse.component';

describe('ItemsWithoutSerialWarehouseComponent', () => {
  let component: ItemsWithoutSerialWarehouseComponent;
  let fixture: ComponentFixture<ItemsWithoutSerialWarehouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemsWithoutSerialWarehouseComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsWithoutSerialWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
