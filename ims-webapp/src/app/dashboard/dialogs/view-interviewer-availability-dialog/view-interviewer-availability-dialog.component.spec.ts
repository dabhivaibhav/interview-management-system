import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInterviewerAvailabilityDialogComponent } from './view-interviewer-availability-dialog.component';

describe('ViewInterviewerAvailabilityDialogComponent', () => {
  let component: ViewInterviewerAvailabilityDialogComponent;
  let fixture: ComponentFixture<ViewInterviewerAvailabilityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewInterviewerAvailabilityDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInterviewerAvailabilityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
