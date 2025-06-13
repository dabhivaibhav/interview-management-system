import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewerAvailabilityComponent } from './interviewer-availability.component';

describe('InterviewerAvailabilityComponent', () => {
  let component: InterviewerAvailabilityComponent;
  let fixture: ComponentFixture<InterviewerAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewerAvailabilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewerAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
