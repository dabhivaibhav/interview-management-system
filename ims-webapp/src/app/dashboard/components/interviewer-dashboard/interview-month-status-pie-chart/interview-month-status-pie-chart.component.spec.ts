import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewMonthStatusPieChartComponent } from './interview-month-status-pie-chart.component';

describe('InterviewMonthStatusPieChartComponent', () => {
  let component: InterviewMonthStatusPieChartComponent;
  let fixture: ComponentFixture<InterviewMonthStatusPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewMonthStatusPieChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewMonthStatusPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
