/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DeviceCancelComponent } from './device-cancel.component';

describe('DeviceCancelComponent', () => {
  let component: DeviceCancelComponent;
  let fixture: ComponentFixture<DeviceCancelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeviceCancelComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
