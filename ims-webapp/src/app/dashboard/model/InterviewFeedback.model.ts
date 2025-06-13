export class InterviewFeedback {
    id = 0;
    interviewId = 0;
    type = '';
    comments = '';
    status = '';
    frontendScore = 0;
    backendScore = 0;
    databaseScore = 0;
    ceoRoundRequired = 'YES';
    communicationScore = 0;
    fileName: string | undefined = '';

    constructor() {}

    convertFormDataToJson(data: any): void {
    this.id = data.id;
    this.interviewId = data.interviewId;
    this.type = data.type;
    this.comments = data.comments.trim();
    this.status = data.status;
    this.frontendScore = parseInt(data.frontendScore, 10);
    this.backendScore = parseInt(data.backendScore, 10);
    this.databaseScore = parseInt(data.databaseScore, 10);
    this.communicationScore = parseInt(data.communicationScore, 10);
    this.ceoRoundRequired = data.ceoRoundRequired;
    }
}
