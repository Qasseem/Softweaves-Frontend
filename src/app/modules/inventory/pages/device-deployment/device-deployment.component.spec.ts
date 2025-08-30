/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DeviceDeploymentComponent } from './device-deployment.component';

describe('DeviceDeploymentComponent', () => {
  let component: DeviceDeploymentComponent;
  let fixture: ComponentFixture<DeviceDeploymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeviceDeploymentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceDeploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
