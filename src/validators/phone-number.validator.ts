import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'phone', async: false })
export class PhoneNumberValidator implements ValidatorConstraintInterface {
  validate(phone: string, args: ValidationArguments) {
    const regex = new RegExp(/^09\d{7,9}$/);
    return regex.test(phone);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid phone number';
  }
}
