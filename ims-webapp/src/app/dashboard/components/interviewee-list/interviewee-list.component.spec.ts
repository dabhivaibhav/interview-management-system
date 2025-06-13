import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervieweeListComponent } from './interviewee-list.component';

describe('IntervieweeListComponent', () => {
  let component: IntervieweeListComponent;
  let fixture: ComponentFixture<IntervieweeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntervieweeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntervieweeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
