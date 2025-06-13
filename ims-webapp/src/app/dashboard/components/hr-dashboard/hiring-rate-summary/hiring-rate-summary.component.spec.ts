import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiringRateSummaryComponent } from './hiring-rate-summary.component';

describe('HiringRateSummaryComponent', () => {
  let component: HiringRateSummaryComponent;
  let fixture: ComponentFixture<HiringRateSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiringRateSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiringRateSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
