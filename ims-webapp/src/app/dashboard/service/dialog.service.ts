import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../dialogs/delete-dialog/delete-dialog.component';
import { AddUpdateAvailabilityComponent } from '../dialogs/add-update-availability/add-update-availability.component';
import { AddUpdateInterviewerComponent } from '../dialogs/add-update-interviewer/add-update-interviewer.component';
import { AddUpdateInterviewComponent } from '../dialogs/add-update-interview/add-update-interview.component';
import { AddUpdateIntervieweeComponent } from '../dialogs/add-update-interviewee/add-update-interviewee/add-update-interviewee.component';
import { InterviewCancelComponent } from '../components/interview-cancel/interview-cancel.component';
import { InterviewFeedbackComponent } from '../components/interview-feedback/interview-feedback.component';
import { InterviewerComponent } from '../dialogs/interviewer/interviewer.component';
import { LogoutComponent } from '../dialogs/logout/logout.component';
import { IntervieweeDetailsDialogComponent } from '../dialogs/interviewee-details-dialog/interviewee-details-dialog.component';
import { InterviewDetailsDialogComponent } from '../dialogs/interview-details-dialog/interview-details-dialog.component';
import { ViewInterviewerAvailabilityDialogComponent } from '../dialogs/view-interviewer-availability-dialog/view-interviewer-availability-dialog.component';
import { RequestRescheduleComponent } from '../dialogs/request-reschedule/request-reschedule.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openDeleteDialog(description: string): MatDialogRef<DeleteDialogComponent> {
    return this.dialog.open(DeleteDialogComponent, {
      width: 'fit-content',
      disableClose: true,
      data: {
        message: description
      },
      autoFocus: false
    });
  }

  openLogoutDialog(): MatDialogRef<LogoutComponent> {
    return this.dialog.open(LogoutComponent, {
      width: 'fit-content',
      disableClose: true,
      autoFocus: false
    });
  }

  openAddUpdateAvailabilityDialog(data: any): MatDialogRef<AddUpdateAvailabilityComponent> {
    return this.dialog.open(AddUpdateAvailabilityComponent, {
      width: '600px',
      maxWidth:'95%',
      disableClose: true,
      data,
      autoFocus: false
    });
  }

  openAddUpdateIntervieweeDialog(id: any, title: any): MatDialogRef<AddUpdateIntervieweeComponent>{
    return this.dialog.open(AddUpdateIntervieweeComponent, {
      width: '750px',
      maxWidth:'95%',
      disableClose: true,
      data: { title, id},
      autoFocus: false
    });
  }
  openViewIntervieweeDialog(element: any): MatDialogRef<IntervieweeDetailsDialogComponent> {
    return this.dialog.open(IntervieweeDetailsDialogComponent, {
      width: '700px',
      maxWidth:'95%',
      disableClose: true,
      data: element,
      autoFocus: false
    });
  }

  openInterviewetailsDialog(element: any): MatDialogRef<InterviewDetailsDialogComponent> {
    return this.dialog.open(InterviewDetailsDialogComponent, {
      width: '900px',
      maxWidth:'95%',
      disableClose: true,
      data: element,
      autoFocus: false
    });
  }

  openViewInterviewerAvailabilityDialog(element: any): MatDialogRef<ViewInterviewerAvailabilityDialogComponent> {
    return this.dialog.open(ViewInterviewerAvailabilityDialogComponent, {
      width: '800px',
      maxWidth:'95%',
      height: 'fit-content',
      disableClose: true,
      data: element,
      autoFocus: false
    });
  }

  openAddUpdateInterviewerDialog(id: number): MatDialogRef<AddUpdateInterviewerComponent> {
    return this.dialog.open(AddUpdateInterviewerComponent, {
      width: '600px',
      maxWidth:'95%',
      disableClose: true,
      data: {
        message: id
      },
      autoFocus: false
    });
  }

  openAddUpdateInterviewDialog(data: any): MatDialogRef<AddUpdateInterviewComponent> {
    return this.dialog.open(AddUpdateInterviewComponent, {
      width: '700px',
      maxWidth:'95%',
      disableClose: true,
      data,
      autoFocus: false
    });
  }

  openCancelInterviewDialog(data: any): MatDialogRef<InterviewCancelComponent> {
    return this.dialog.open(InterviewCancelComponent, {
      width: '600px',
      disableClose: true,
      data,
      autoFocus: false
    });
  }

  openFeedbackInterviewDialog(data: any): MatDialogRef<InterviewFeedbackComponent> {
    return this.dialog.open(InterviewFeedbackComponent, {
      width: '600px',
      maxWidth:'95%',
      disableClose: true,
      data,
      autoFocus: false
    });
  }

  openRequestReschedulingDialog(data: any): MatDialogRef<RequestRescheduleComponent> {
    return this.dialog.open(RequestRescheduleComponent, {
      width: '700px',
      maxWidth:'95%',
      disableClose: true,
      data,
      autoFocus: false
    });
  }

  openInterviewerDialog(data: any): MatDialogRef<InterviewerComponent> {
    return this.dialog.open(InterviewerComponent, {
      width: '600px',
      maxWidth:'95%',
      disableClose: true,
      data,
      autoFocus: false
    });
  }
}
