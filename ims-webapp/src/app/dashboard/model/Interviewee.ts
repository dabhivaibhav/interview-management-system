import { Department } from './Department';
import { Designation } from './Designation';

export class Interviewee {
    id = 0;
    name = '';
    email = '';
    phone = '';
    resume: string | undefined = '';
    currentCompany = '';
    currentCTC = '';
    expectedCTC = '';
    noticePeriod = '';
    yoe = '';
    isResumePresent = false;
    designation = new Designation();
    department = new Department();
    constructor(){}
}
