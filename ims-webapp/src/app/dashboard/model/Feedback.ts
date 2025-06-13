export class Feedback {
    id !: number;
    name !: string;
    email !: string;
    overallScore !: number;
    scheduledAt !: Date;
    roundType !: string;

    constructor(id: number, name: string, email: string, overallScore: number, scheduledAt: Date, roundType: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.overallScore = overallScore;
        this.scheduledAt = scheduledAt;
        this.roundType = roundType;
      }
}
