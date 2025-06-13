// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  imsUrl: 'ims',
  dashboardUrl: 'dashboard',
  interviewUrl: 'interview-list',
  intervieweeUrl: 'interviewee-list',
  interviewerUrl: 'interviewer-list',
  availabilityUrl: 'availability-list',
  myAvailabilityUrl : 'my-availability',
  profileUrl: 'profile',
  interviewerMeetingUrl: 'interviewer-meeting',
  intervieweeMeetingUrl: 'interviewee-meeting',
  hrInterviewsUrl: 'my-interviews',
  loginUrl: 'login',
  returnUrl: 'returnUrl',
  requestedRescheduling: 'reschedule-request-interviews',
  myFeedback: 'my-feedback',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
