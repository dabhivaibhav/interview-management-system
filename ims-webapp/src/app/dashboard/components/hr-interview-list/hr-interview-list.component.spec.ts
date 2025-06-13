import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrInterviewListComponent } from './hr-interview-list.component';

describe('HrInterviewListComponent', () => {
  let component: HrInterviewListComponent;
  let fixture: ComponentFixture<HrInterviewListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrInterviewListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HrInterviewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
