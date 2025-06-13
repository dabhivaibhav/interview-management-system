import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervieweeDetailsDialogComponent } from './interviewee-details-dialog.component';

describe('IntervieweeDetailsDialogComponent', () => {
  let component: IntervieweeDetailsDialogComponent;
  let fixture: ComponentFixture<IntervieweeDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntervieweeDetailsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntervieweeDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
