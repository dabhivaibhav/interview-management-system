import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NotificationService } from 'src/app/notification.service';
import { MeetingService } from 'src/app/dashboard/service/meeting.service';
import { NameWhiteSpace } from 'src/app/name-white-space';
import { environment } from 'src/environments/environment';
declare var JitsiMeetExternalAPI: any;

@Component({
  selector: 'app-interviewee-jitsi',
  templateUrl: './interviewee-jitsi.component.html',
  styleUrls: ['./interviewee-jitsi.component.css']
})
export class IntervieweeJitsiComponent implements OnInit, AfterViewInit {
  hashCode !: any;
  linkExpired = false;
  hostConfirmation = false;
  domain = 'meet.engagemedia.org'; // For self hosted use your domain
  room: any;
  options: any;
  api: any;
  user: any;
  meetingId !: number;
  isLoading = false;
  subcription !: Subscription;
  emailPattern: RegExp = /^[\d\w]+(\.[\d\w]+)*@[\d\w]+(\.[\d\w]+)*\.[\d\w]{2,}$/;

  // For Custom Controls
  isAudioMuted = false;
  isVideoMuted = false;

  intervieweeVerificationForm: any = new FormGroup({
    email: new FormControl(
      '',
      [Validators.required, NameWhiteSpace.noSpaceAllowed, Validators.pattern(this.emailPattern)]),
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private meetingService: MeetingService,
    private notifyService: NotificationService
  ) {
    this.hashCode = this.activatedRoute.snapshot.paramMap.get('hashCode');
  }

  ngOnInit(): void {
    const roomRes = atob(this.hashCode);
    const map = JSON.parse(roomRes);
    if (map.meetingLink) {
      this.meetingId = map.interviewId;
      this.room = map.meetingLink; // Set your room name
    }
  }

 get fc(): { [key: string]: AbstractControl } {
    return this.intervieweeVerificationForm.controls;
  }

  checkConfirmation = (): void => {
    if (this.meetingId === undefined || this.room === undefined) {
      this.isLoading = false;
      this.notifyService.showError('Enter Valid meeting link', 'Failed');
    }
    if (this.hostConfirmation === false && this.meetingId !== undefined && this.room !== undefined) {
      this.subcription = timer(0, 5000).pipe(
        switchMap(() => this.meetingService.checkInterviewerStatus(this.meetingId))
      ).subscribe((result: any) => {
        if (result.data.linkExpired === true){
          this.isLoading = false;
          this.notifyService.showError('The meeting link has expired', 'Failed');
          this.subcription.unsubscribe();
        }
        if (result.data.isJoined === true) {
          this.isLoading = false;
          this.subcription.unsubscribe();
          this.hostConfirmation = true;

          this.options = {
            roomName: this.room,
            width: '100%',
            height: '100%',
            configOverwrite: { prejoinPageEnabled: false },
            interfaceConfigOverwrite: {
              TILE_VIEW_MAX_COLUMNS: 8
            },
            parentNode: document.querySelector('#jitsi-iframe'),
            userInfo: {
              displayName: this.user.name,
              moderator: true,
            },
          };

          this.api = new JitsiMeetExternalAPI(this.domain, this.options);

          // Event handlers
          this.api.addEventListeners({
            readyToClose: this.handleClose,
            participantLeft: this.handleParticipantLeft,
            participantJoined: this.handleParticipantJoined,
            participantRoleChanged: this.handleparticipantRoleChanged,
            videoConferenceJoined: this.handleVideoConferenceJoined,
            videoConferenceLeft: this.handleVideoConferenceLeft,
            audioMuteStatusChanged: this.handleMuteStatus,
            videoMuteStatusChanged: this.handleVideoStatus
          });
        }
      },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }
  // ngOnDestroy = (): void => {
  //   this.api.executeCommand('endConference');
  // }
  ngAfterViewInit(): void {

  }
  handleClose = () => {
    console.log('handleClose');
  }

  handleparticipantRoleChanged = (event: any): void => {
    if (event.role === 'moderator' && this.hostConfirmation === true) {
      this.executeCommand('hangup');
    }
  }

  checkHostStatus = (id: number): void => {
    this.meetingService.checkInterviewerStatus(id);
  }

  handleParticipantLeft = async (participant: any) => {
    console.log('handleParticipantLeft', participant); // { id: "2baa184e" }
    const data = await this.getParticipants();
  }


  handleParticipantJoined = async (participant: any) => {
    console.log('handleParticipantJoined', participant);
    // { id: "2baa184e", displayName: "Shanu Verma", formattedDisplayName: "Shanu Verma" }
    const data = await this.getParticipants();
  }

  handleVideoConferenceJoined = async (participant: any) => {
    console.log('handleVideoConferenceJoined', participant);
    // { roomName: "bwb-bfqi-vmh", id: "8c35a951", displayName: "Akash Verma", formattedDisplayName: "Akash Verma (me)"}
    const data = await this.getParticipants();
  }

  handleVideoConferenceLeft = () => {
    console.log('handleVideoConferenceLeft');
    this.router.navigate(['/thank-you']);
  }

  handleMuteStatus = (audio: any) => {
    console.log('handleMuteStatus', audio); // { muted: true }
  }

  handleVideoStatus = (video: any) => {
    console.log('handleVideoStatus', video); // { muted: true }
  }

  getParticipants = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.api.getParticipantsInfo()); // get all participants
      }, 500);
    });
  }


  executeCommand = (command: string): void => {
    this.api.executeCommand(command);
    if (command === 'passwordEnable') {
      this.api.executeCommand('password', '123456');
    }

    if (command === 'moderator') {
      this.api.executeCommand('grantModerator', this.user.name);
    }

    if (command === 'startRecording') {
      this.api.executeCommand('startRecording', {
        mode: 'file', // recording mode, either `local`, `file` or `stream`.
        dropboxToken: '', // dropbox oauth2 token.
        onlySelf: false,  // Whether to only record the local streams. Only applies to `local` recording mode.
        shouldShare: false, // whether the recording should be shared with the participants or not.
        // Only applies to certain jitsi meet deploys.
        rtmpStreamKey: '', // the RTMP stream key.
        rtmpBroadcastID: '1234', // the RTMP broadcast ID.
        youtubeStreamKey: '1234', // the youtube stream key.
        youtubeBroadcastID: '', // the youtube broacast ID.
        extraMetada: Object // any extra metada for file recording.
      });
    }
    if (command === 'hangup') {
      this.router.navigate(['/thank-you']);
      return;
    }

    if (command === 'toggleAudio') {
      this.isAudioMuted = !this.isAudioMuted;
    }

    if (command === 'toggleVideo') {
      this.isVideoMuted = !this.isVideoMuted;
    }

    if (command === 'endConference') {
      this.api.executeCommand('endConference');
      this.router.navigate([{ name: 'Dashboard', link: `/${environment.imsUrl}/${environment.dashboardUrl}`}]);
    }

    if (command === 'hangup') {
      this.api.executeCommand('hangup');
    }
  }

  startMeeting = (): void => {
    if (this.fc.email.errors === null) {
      this.user = {
        name: this.intervieweeVerificationForm.value.email // Set your username
      };
      this.isLoading = true;
      this.checkConfirmation();
    }else{
      return;
    }
  }

}
