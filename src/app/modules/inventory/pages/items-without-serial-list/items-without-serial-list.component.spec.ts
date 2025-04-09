/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ItemsWithoutSerialListComponent } from './items-without-serial-list.component';

describe('ItemsWithoutSerialListComponent', () => {
  let component: ItemsWithoutSerialListComponent;
  let fixture: ComponentFixture<ItemsWithoutSerialListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemsWithoutSerialListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsWithoutSerialListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
