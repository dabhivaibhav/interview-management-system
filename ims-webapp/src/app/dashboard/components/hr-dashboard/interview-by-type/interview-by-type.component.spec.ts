import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewByTypeComponent } from './interview-by-type.component';

describe('InterviewByTypeComponent', () => {
  let component: InterviewByTypeComponent;
  let fixture: ComponentFixture<InterviewByTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewByTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewByTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
