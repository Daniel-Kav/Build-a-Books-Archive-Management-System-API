import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsAlphanumericWithSpaces(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAlphanumericWithSpaces',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && /^[a-zA-Z0-9 ]+$/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must contain only letters, numbers, and spaces`;
        },
      },
    });
  };
} 