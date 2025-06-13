import { TestBed } from '@angular/core/testing';

import { IntervieweeService } from './interviewee.service';

describe('IntervieweeService', () => {
  let service: IntervieweeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntervieweeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
