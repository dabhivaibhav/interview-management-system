import { AbstractControl, ValidationErrors } from '@angular/forms';

export class PassowrdMatchValidator {

  static passwordMatchValidators(control: AbstractControl): ValidationErrors | null {

    const passwordControl: any = control.get('newPassword');
    const confirmPasswordControl: any = control.get('confirmPassword');
    if (passwordControl.value === confirmPasswordControl.value) {
      return null;
    }
    return { PassowrdMatchValidator: true };
  }
}
