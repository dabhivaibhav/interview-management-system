import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateAvailabilityComponent } from './add-update-availability.component';

describe('AddUpdateAvailabilityComponent', () => {
  let component: AddUpdateAvailabilityComponent;
  let fixture: ComponentFixture<AddUpdateAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateAvailabilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
