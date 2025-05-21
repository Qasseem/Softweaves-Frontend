/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ItemsWithoutSerialEmployeeComponent } from './items-without-serial-employee.component';

describe('ItemsWithoutSerialEmployeeComponent', () => {
  let component: ItemsWithoutSerialEmployeeComponent;
  let fixture: ComponentFixture<ItemsWithoutSerialEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemsWithoutSerialEmployeeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsWithoutSerialEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
