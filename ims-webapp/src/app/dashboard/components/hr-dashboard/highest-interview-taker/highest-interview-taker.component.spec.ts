import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighestInterviewTakerComponent } from './highest-interview-taker.component';

describe('HighestInterviewTakerComponent', () => {
  let component: HighestInterviewTakerComponent;
  let fixture: ComponentFixture<HighestInterviewTakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighestInterviewTakerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HighestInterviewTakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
