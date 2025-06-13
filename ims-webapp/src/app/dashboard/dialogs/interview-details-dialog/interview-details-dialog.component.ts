import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IntervieweeDetailsDialogComponent } from '../interviewee-details-dialog/interviewee-details-dialog.component';
import { MatStepper } from '@angular/material/stepper';
import { InterviewFeedbackService } from '../../interview-feedback.service';
import { DialogService } from '../../service/dialog.service';

@Component({
  selector: 'app-interview-details-dialog',
  templateUrl: './interview-details-dialog.component.html',
  styleUrls: ['./interview-details-dialog.component.css']
})
export class InterviewDetailsDialogComponent implements OnInit, AfterViewInit {

  isLoading = false;
  steps: any[] = [
    { id: 1, label: 'Telephonic', completed: false, icon: 'call', state: 'not-complete', content: null, pending: false },
    { id: 2, label: 'Technical', completed: false, icon: 'question_answer', state: 'not-complete', content: null, pending: false },
    { id: 3, label: 'Practical', completed: false, icon: 'code', state: 'not-complete', content: null, pending: false },
    { id: 4, label: 'CEO', completed: false, icon: 'person', state: 'not-complete', content: null, pending: false },
    { id: 5, label: 'HR', completed: false, icon: 'description', state: 'not-complete', content: null, pending: false },
    { id: 6, label: 'Done', completed: false, icon: 'done', state: 'not-complete', content: null, pending: false },

  ];
  @ViewChildren('stepperIcon') private matStepperIconViewChildren?: { toArray: () => any; };

  matStepperIcons: any;
  desiredIndex = 0;
  @ViewChild(MatStepper) stepper!: MatStepper;
  constructor(
    private cdr: ChangeDetectorRef,
    private dialog: DialogService,
    private dialogRef: MatDialogRef<IntervieweeDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private interviewFeedBackService: InterviewFeedbackService) {
    const interviewFeedBack = data.interviewFeedbackList;
    interviewFeedBack.map((element: any) => {
      const rt = element?.roundType.id;
      switch (rt) {
        case 1:
          this.steps[0] = { ...this.steps[0], content: element, completed: true, state: 'complete' };
          break;
        case 2:
          this.steps[1] = { ...this.steps[1], content: element, completed: true, state: 'complete' };
          break;
        case 3:
          this.steps[2] = { ...this.steps[2], content: element, completed: true, state: 'complete' };
          break;
        case 4:
          this.steps[3] = { ...this.steps[3], content: element, completed: true, state: 'complete' };
          break;
        case 5:
          this.steps[4] = { ...this.steps[4], content: element, completed: true, state: 'complete' };
          break;
        default:
          break;
      }
    });

  }

  ngOnInit(): void {
    const incomplete = (this.steps.find((step) => (!step.completed)));
    this.desiredIndex = incomplete ? incomplete.id - 1 : 0;
    if (this.desiredIndex === 5) {
      this.steps[this.desiredIndex] = { ...this.steps[this.desiredIndex], pending: false, completed: true, state: 'complete' };
    }
    else {
      if (this.data.scheduledAt) {
        const content = {
          interviewerEmail: this.data.interviewerEmail,
          scheduledAt: this.data.scheduledAt,
          status: this.data.status.status,
          rescheduleReason: this.data.rescheduleReason,
          rescheduleAt: this.data.rescheduleAt,
          interviewerName: `${this.data.interviewerFirstName} ${this.data.interviewerLastName}`
        };
        this.steps[this.desiredIndex] = { ...this.steps[this.desiredIndex], pending: true, content, state: 'pending' };
      }
      else {
        this.steps[this.desiredIndex] = { ...this.steps[this.desiredIndex], state: 'not-scheduled' };
      }
    }


  }
  ngAfterViewInit(): void {
    this.matStepperIcons = this.matStepperIconViewChildren?.toArray();
    this.cdr.detectChanges();
  }
  closeDialog(): void {
    this.dialogRef.close(false);
  }
  viewFeedback(data: any): any {
    this.dialog.openFeedbackInterviewDialog(
      {
        id: data.id,
        feedbackSubmitted: true,
        isInterviewFeedbackIdKnown: true,
        status: data.status
      });
  }
}
