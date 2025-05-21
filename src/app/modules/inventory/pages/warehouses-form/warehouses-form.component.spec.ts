/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WarehousesFormComponent } from './warehouses-form.component';

describe('WarehousesFormComponent', () => {
  let component: WarehousesFormComponent;
  let fixture: ComponentFixture<WarehousesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WarehousesFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehousesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
