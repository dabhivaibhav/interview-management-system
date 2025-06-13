import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervieweeJitsiComponent } from './interviewee-jitsi.component';

describe('IntervieweeJitsiComponent', () => {
  let component: IntervieweeJitsiComponent;
  let fixture: ComponentFixture<IntervieweeJitsiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntervieweeJitsiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntervieweeJitsiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
