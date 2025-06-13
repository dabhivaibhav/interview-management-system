import { AbstractControl, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';

export class ScheduledAtValidator {

    static ScheduledAtValidation(control: AbstractControl): ValidationErrors | null {
        const val = control.value;
        const beforeTime = moment('09:00', 'HH:mm');
        const afterTime = moment('18:00', 'HH:mm');
        const momentTime = moment(val, 'HH:mm');
        if (momentTime.isBefore(beforeTime) || momentTime.isAfter(afterTime)) {
            return { scheduledAtValidation: true };
        }
        return null;
    }
}
