/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CompletetTicketComponent } from './completet-ticket.component';

describe('CompletetTicketComponent', () => {
  let component: CompletetTicketComponent;
  let fixture: ComponentFixture<CompletetTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompletetTicketComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletetTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
