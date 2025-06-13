import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopInterviewerBarComponent } from './top-interviewer-bar.component';

describe('TopInterviewerBarComponent', () => {
  let component: TopInterviewerBarComponent;
  let fixture: ComponentFixture<TopInterviewerBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopInterviewerBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopInterviewerBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
