import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewCancelComponent } from './interview-cancel.component';

describe('InterviewCancelComponent', () => {
  let component: InterviewCancelComponent;
  let fixture: ComponentFixture<InterviewCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewCancelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
