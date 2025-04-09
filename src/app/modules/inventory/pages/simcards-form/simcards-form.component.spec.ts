/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SimcardsFormComponent } from './simcards-form.component';

describe('SimcardsFormComponent', () => {
  let component: SimcardsFormComponent;
  let fixture: ComponentFixture<SimcardsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SimcardsFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimcardsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
