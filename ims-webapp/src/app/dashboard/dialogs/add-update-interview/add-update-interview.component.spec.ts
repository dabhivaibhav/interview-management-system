import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateInterviewComponent } from './add-update-interview.component';

describe('AddUpdateInterviewComponent', () => {
  let component: AddUpdateInterviewComponent;
  let fixture: ComponentFixture<AddUpdateInterviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateInterviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
