import { TestBed } from '@angular/core/testing';

import { InterviewerDashboardService } from './interviewer-dashboard.service';

describe('InterviewerDashboardService', () => {
  let service: InterviewerDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterviewerDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
