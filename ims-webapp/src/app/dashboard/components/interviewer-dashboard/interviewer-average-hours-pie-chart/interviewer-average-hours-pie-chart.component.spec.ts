import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewerAverageHoursPieChartComponent } from './interviewer-average-hours-pie-chart.component';

describe('InterviewerAverageHoursPieChartComponent', () => {
  let component: InterviewerAverageHoursPieChartComponent;
  let fixture: ComponentFixture<InterviewerAverageHoursPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewerAverageHoursPieChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewerAverageHoursPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
