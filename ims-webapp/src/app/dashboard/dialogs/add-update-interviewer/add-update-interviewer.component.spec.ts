import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateInterviewerComponent } from './add-update-interviewer.component';

describe('AddUpdateInterviewerComponent', () => {
  let component: AddUpdateInterviewerComponent;
  let fixture: ComponentFixture<AddUpdateInterviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateInterviewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateInterviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
