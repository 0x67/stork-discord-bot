import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isAfter } from 'date-fns';

@ValidatorConstraint({ async: false })
export class IsNotPastDateConstraint implements ValidatorConstraintInterface {
  validate(date: Date) {
    return (
      isAfter(date, new Date()) ||
      date.toDateString() === new Date().toDateString()
    );
  }

  defaultMessage() {
    return 'Date cannot be in the past!';
  }
}

export function IsNotPastDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNotPastDateConstraint,
    });
  };
}
