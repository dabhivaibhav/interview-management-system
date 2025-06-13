import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewsRemainingFeedbackListComponent } from './interviews-remaining-feedback-list.component';

describe('InterviewsRemainingFeedbackListComponent', () => {
  let component: InterviewsRemainingFeedbackListComponent;
  let fixture: ComponentFixture<InterviewsRemainingFeedbackListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewsRemainingFeedbackListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewsRemainingFeedbackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
