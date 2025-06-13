import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewMonthlySummaryBarChartComponent } from './interview-monthly-summary-bar-chart.component';

describe('InterviewMonthlySummaryBarChartComponent', () => {
  let component: InterviewMonthlySummaryBarChartComponent;
  let fixture: ComponentFixture<InterviewMonthlySummaryBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewMonthlySummaryBarChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewMonthlySummaryBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
