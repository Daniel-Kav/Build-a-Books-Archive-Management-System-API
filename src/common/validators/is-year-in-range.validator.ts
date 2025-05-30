import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsYearInRange(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isYearInRange',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const year = Number(value);
          const currentYear = new Date().getFullYear();
          return (
            Number.isInteger(year) &&
            year >= 1000 &&
            year <= currentYear
          );
        },
        defaultMessage(args: ValidationArguments) {
          const currentYear = new Date().getFullYear();
          return `${args.property} must be an integer between 1000 and ${currentYear}`;
        },
      },
    });
  };
} 