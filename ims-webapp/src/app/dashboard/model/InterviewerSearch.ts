export class InterviewerSearch {
    id: number;
    search: string;
    designation: string;
    yoe: string;
    isActive: string;
    type: string;

    constructor(id: number, search: string, designation: string, yoe: string, isActive: string, type: string) {
        this.id = id;
        this.search = search;
        this.designation = designation;
        this.yoe = yoe;
        this.isActive = isActive;
        this.type = type;
    }
}
