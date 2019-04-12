import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateprofilePage } from './updateprofile.page';

describe('UpdateprofilePage', () => {
  let component: UpdateprofilePage;
  let fixture: ComponentFixture<UpdateprofilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateprofilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateprofilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
