import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RescheduleRequestInterviewsComponent } from './reschedule-request-interviews.component';

describe('RescheduleRequestInterviewsComponent', () => {
  let component: RescheduleRequestInterviewsComponent;
  let fixture: ComponentFixture<RescheduleRequestInterviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RescheduleRequestInterviewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RescheduleRequestInterviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
