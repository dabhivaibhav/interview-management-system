import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateIntervieweeComponent } from './add-update-interviewee.component';

describe('AddUpdateIntervieweeComponent', () => {
  let component: AddUpdateIntervieweeComponent;
  let fixture: ComponentFixture<AddUpdateIntervieweeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateIntervieweeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateIntervieweeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
