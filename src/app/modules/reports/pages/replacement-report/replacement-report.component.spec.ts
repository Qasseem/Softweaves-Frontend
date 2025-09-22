/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReplacementReportComponent } from './replacement-report.component';

describe('ReplacementReportComponent', () => {
  let component: ReplacementReportComponent;
  let fixture: ComponentFixture<ReplacementReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReplacementReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplacementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
