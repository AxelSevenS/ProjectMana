import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class AuthenticationValidators {

  static confirmPasswordValidator(control1: string, control2: string): ValidatorFn {
    return ( control: AbstractControl ): ValidationErrors | null => {
      return control.value[control1] !== control.value[control2]
        ? { PasswordNoMatch: true }
        : null;
    }
  };

  static securePasswordValidator: ValidatorFn = ( control: AbstractControl ): ValidationErrors | null => {
    let errors = {
      PasswordNoUppercase: ! new RegExp('(?=.*[A-Z])').test(control.value),
      PasswordNoLowercase: ! new RegExp('(?=.*[a-z])').test(control.value),
      PasswordNoDigit: ! new RegExp('(.*[0-9].*)').test(control.value),
      PasswordNoSpecial: ! new RegExp('(?=.*[!@#$%^&*])').test(control.value),
      PasswordTooShort: ! new RegExp('.{8,}').test(control.value),
    };

    return errors.PasswordNoUppercase || errors.PasswordNoLowercase || errors.PasswordNoDigit || errors.PasswordNoSpecial || errors.PasswordTooShort
      ? errors
      : null;
  };
}