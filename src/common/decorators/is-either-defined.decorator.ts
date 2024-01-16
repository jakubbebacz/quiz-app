import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export const IsEitherDefined =
  (validationOptions?: ValidationOptions) =>
  (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isEitherDefined',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate: (value, args: ValidationArguments) => {
          const isCorrect = args.object['isCorrect'];
          const sortOrder = args.object['sortOrder'];

          return isCorrect === undefined || sortOrder === undefined;
        },
        defaultMessage: () => {
          return "You can't provide both isCorrect and sortOrder fields simultaneously.";
        },
      },
    });
  };
