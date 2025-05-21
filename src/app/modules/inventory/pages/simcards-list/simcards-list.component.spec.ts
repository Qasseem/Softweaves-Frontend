/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SimcardsListComponent } from './simcards-list.component';

describe('SimcardsListComponent', () => {
  let component: SimcardsListComponent;
  let fixture: ComponentFixture<SimcardsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SimcardsListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimcardsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
