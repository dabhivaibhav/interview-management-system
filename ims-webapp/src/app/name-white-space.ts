import { AbstractControl, ValidationErrors } from '@angular/forms';

export class NameWhiteSpace {
    static noSpaceAllowed(control: AbstractControl): ValidationErrors | null {
        if (typeof control.value === 'string' && !(control.value as string).replace(/\s/g, '').length) {
            return { noSpaceAllowed: true };
        }
        return null;
    }
}
