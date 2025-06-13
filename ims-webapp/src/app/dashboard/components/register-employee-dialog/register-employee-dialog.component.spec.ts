import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterEmployeeDialogComponent } from './register-employee-dialog.component';

describe('RegisterEmployeeDialogComponent', () => {
  let component: RegisterEmployeeDialogComponent;
  let fixture: ComponentFixture<RegisterEmployeeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterEmployeeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterEmployeeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
