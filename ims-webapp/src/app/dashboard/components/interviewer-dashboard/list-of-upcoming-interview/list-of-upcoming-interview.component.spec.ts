import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfUpcomingInterviewComponent } from './list-of-upcoming-interview.component';

describe('ListOfUpcomingInterviewComponent', () => {
  let component: ListOfUpcomingInterviewComponent;
  let fixture: ComponentFixture<ListOfUpcomingInterviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOfUpcomingInterviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfUpcomingInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
