import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsNotInFuture(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNotInFuture',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return true;
          const date = new Date(value);
          return date <= new Date();
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must not be in the future`;
        },
      },
    });
  };
} 