import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestRescheduleComponent } from './request-reschedule.component';

describe('RequestRescheduleComponent', () => {
  let component: RequestRescheduleComponent;
  let fixture: ComponentFixture<RequestRescheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestRescheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestRescheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
