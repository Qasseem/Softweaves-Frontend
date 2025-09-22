/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CancellationReportComponent } from './cancellation-report.component';

describe('CancellationReportComponent', () => {
  let component: CancellationReportComponent;
  let fixture: ComponentFixture<CancellationReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CancellationReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancellationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
