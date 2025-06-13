import { Designation } from './Designation';

export class Interviewer {
    id !: number;
    firstName !: string;
    lastName !: string;
    email !: string;
    password !: string;
    confPassword !: string;
    designation = new Designation();
    yoe !: string;
    isActive !: boolean;
    type !: string;
    role!: {id: number, type: string};
    department!: {id: number, department: string};
}
