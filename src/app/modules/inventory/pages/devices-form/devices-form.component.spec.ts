/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DevicesFormComponent } from './devices-form.component';

describe('DevicesFormComponent', () => {
  let component: DevicesFormComponent;
  let fixture: ComponentFixture<DevicesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DevicesFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
