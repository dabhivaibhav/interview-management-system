import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingService } from '../../service/meeting.service';
import { environment } from 'src/environments/environment';
declare var JitsiMeetExternalAPI: any;

@Component({
  selector: 'app-jitsi',
  templateUrl: './jitsi.component.html',
  styleUrls: ['./jitsi.component.css']
})
export class JitsiComponent implements OnInit, AfterViewInit{

  hashCode !: any;
  domain = 'meet.engagemedia.org'; // For self hosted use your domain
  room !: any ;
  options: any;
  api: any;
  user: any;
  interviewId !: number;
  id: any;
  // For Custom Controls
  isAudioMuted = false;
  isVideoMuted = false;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private meetingService: MeetingService
  ) {
    this.hashCode = this.route.snapshot.paramMap.get('hashCode');
  }

  ngOnInit(): void {
    const roomRes = atob(this.hashCode);
    const map = JSON.parse(roomRes);
    if (map.meetingLink) {
      this.room = map.meetingLink; // Set your room name
      this.interviewId = map.interviewId;
      this.user = {
        name: localStorage.getItem('userName') // Set your username
      };
      this.setIsJoined();
    }
    }
    ngAfterViewInit(): void {
      if (this.room !== undefined) {
        this.options = {
            roomName: this.room,
            width: '80%',
            height: 700,
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
            participantJoined: this.handleParticipantJoined,
            participantRoleChanged : this.handleparticipantRoleChanged,
            videoConferenceJoined: this.handleVideoConferenceJoined,
            videoConferenceLeft: this.handleVideoConferenceLeft,
            audioMuteStatusChanged: this.handleMuteStatus,
            videoMuteStatusChanged: this.handleVideoStatus
        });
      }
  }
  handleClose = () => {
    console.log('handleClose');
}

handleparticipantRoleChanged = (event: any): void => {
  if (event.role === 'moderator' && this.id === undefined) {
    this.executeCommand('startRecording');
  }
}

handleParticipantJoined = async (participant: any) => {
    if (participant.formattedDisplayName === this.user.name) {
      this.api.executeCommand('grantModerator', participant.id );
    }
}

handleVideoConferenceJoined = async (participant: any) => {
  console.log('handleVideoConferenceJoined', participant);
  // { roomName: 'bwb-bfqi-vmh', id: '8c35a951', displayName: 'Akash Verma', formattedDisplayName: 'Akash Verma (me)'}
  const data = await this.getParticipants();
  if (participant.displayName === this.user.name) {
    this.api.executeCommand('grantModerator', participant.id );
  }
}

handleVideoConferenceLeft = () => {
  console.log('handleVideoConferenceLeft');
  this.meetingService.endMeeting(this.interviewId).subscribe(
    (respose: any) => {
    },
    (error) => {
      console.log(error);
    }
  );
  this.router.navigate([{ name: 'Dashboard', link: `/${environment.imsUrl}/${environment.dashboardUrl}`}]);
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

setIsJoined = (): void => {
  this.meetingService.setIsJoined(this.interviewId).subscribe(
    (respose: any) => {
    },
    (error) => {
      console.log(error);

    }
  );
}

startRecording = (): void => {
  this.executeCommand('startRecording');
}

executeCommand = (command: string): void => {
  this.api.executeCommand(command);
  if (command === 'hangup') {
    this.router.navigate([{ name: 'Dashboard', link: `/${environment.imsUrl}/${environment.dashboardUrl}`}]);
    return;
  }

  if (command === 'passwordEnable') {
    this.api.executeCommand('password', '123456');
  }

  if (command === 'moderator'){
    this.api.executeCommand('grantModerator', this.user.name);
  }

  if (command === 'startRecording'){
    // this.executeCommand('startRecording');
      this.api.executeCommand('startRecording', {
        mode: 'local', // recording mode, either `local`, `file` or `stream`.
        dropboxToken: undefined, // dropbox oauth2 token.
        onlySelf: undefined,
        // Whether to only record the local streams. Only applies to `local` recording mode.
        shouldShare: true,
        // whether the recording should be shared with the participants or not. Only applies to certain jitsi meet deploys.
        rtmpStreamKey: undefined, // the RTMP stream key.
        rtmpBroadcastID: undefined, // the RTMP broadcast ID.
        youtubeStreamKey: undefined, // the youtube stream key.
        youtubeBroadcastID: undefined, // the youtube broacast ID.
        extraMetada: Object // any extra metada for file recording.
      });
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

}
}
