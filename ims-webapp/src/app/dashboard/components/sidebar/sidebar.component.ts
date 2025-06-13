import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView, } from 'angular-calendar';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DialogService } from '../../service/dialog.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { NotificationService } from 'src/app/notification.service';
import { AvailabilityService } from '../../service/availability.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('rotatedState', [
      state('default', style({ transform: 'rotate(0)' })),
      state('rotated', style({ transform: 'rotate(180deg)' })),
      transition('rotated => default', animate('300ms ease-out')),
      transition('default => rotated', animate('300ms ease-in'))
    ])
  ]
})
export class SidebarComponent implements OnInit {
  mobileQuery!: MediaQueryList;
  tabletQuery!: MediaQueryList;
  state = 'default';
  roles: string;
  userName!: string;

  view: CalendarView = CalendarView.Week;
  availabilityAdded !: boolean;
  isLoading = false;
  allAvailability: any[] = [];

  profileUrl = `/${environment.imsUrl}/${environment.profileUrl}`;
  hrNav = [{ name: 'Dashboard', link: `/${environment.imsUrl}/${environment.dashboardUrl}` },
  { name: 'Interview', link: `/${environment.imsUrl}/${environment.interviewUrl}` },
  { name: 'Interviewee', link: `/${environment.imsUrl}/${environment.intervieweeUrl}` },
  { name: 'Interviewer', link: `/${environment.imsUrl}/${environment.interviewerUrl}` },
  { name: 'Availability', link: `/${environment.imsUrl}/${environment.availabilityUrl}` },
  { name: 'My Availability', link: `/${environment.imsUrl}/${environment.myAvailabilityUrl}` },
  { name: 'My Interviews', link: `/${environment.imsUrl}/${environment.hrInterviewsUrl}` },
  { name: 'My Feedbacks', link: `/${environment.imsUrl}/${environment.myFeedback}` },
  { name: 'Rescheduling Request', link: `/${environment.imsUrl}/${environment.requestedRescheduling}` }];

  adminNav = [{ name: 'Dashboard', link: `/${environment.imsUrl}/${environment.dashboardUrl}` },
  { name: 'Interviewer ', link: `/${environment.imsUrl}/${environment.interviewerUrl}` }];
  developerNav = [
    { name: 'Dashboard', link: `/${environment.imsUrl}/${environment.dashboardUrl}` },
    { name: 'My Availability', link: `/${environment.imsUrl}/${environment.myAvailabilityUrl}` },
    { name: 'Interview', link: `/${environment.imsUrl}/${environment.interviewUrl}` },
    { name: 'My Feedbacks', link: `/${environment.imsUrl}/${environment.myFeedback}` }];

  private mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher, private router: Router,
              private dialogService: DialogService,
              private notifyService: NotificationService,
              private availabilityService: AvailabilityService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 768px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
    this.tabletQuery = media.matchMedia('(max-width: 800px)');
    this.tabletQuery.addListener(this.mobileQueryListener);
    this.roles = this.getRole();
  }

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName') || 'user';
    this.getAvailability();
  }

  logout(): void {
    this.dialogService.openLogoutDialog().afterClosed().subscribe((response: any) => {
      if (response) {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        this.router.navigate([`/${environment.loginUrl}`]);
      }
    });
  }
  getRole(): string {
    const token: string = localStorage.getItem('token') ?? '';
    if (token) {
      const decodeTokenObj = JSON.parse(atob(token.split('.')[1]));
      return decodeTokenObj.groups[0];
    }
    return '';
  }

  rotate(): void {
    this.state = (this.state === 'default' ? 'rotated' : 'default');
  }

  getAvailability(): void {
    this.isLoading = true;
    this.availabilityService.getAvailability().subscribe(
      (response: any) => {
        if (response.response) {
          this.allAvailability = response.data;
          const list = new Set(this.allAvailability?.map((d: any) => {
            return d.weekDay;
          }));
          if (list.size < 3){
            this.availabilityAdded = false;
            this.notifyService.showError('Please add availability for atleast 3 days', 'Failed');
            this.router.navigate([`/${environment.imsUrl}/${environment.myAvailabilityUrl}`]);
          }
          else {
            this.availabilityAdded = false;
          }

        } else {
          this.notifyService.showError(response.message, 'Failed');
        }
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        this.notifyService.showError('Something went wrong!', 'Failed');
      }
    );
  }

}
