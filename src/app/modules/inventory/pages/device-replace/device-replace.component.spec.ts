/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DeviceReplaceComponent } from './device-replace.component';

describe('DeviceReplaceComponent', () => {
  let component: DeviceReplaceComponent;
  let fixture: ComponentFixture<DeviceReplaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeviceReplaceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceReplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
