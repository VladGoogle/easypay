import { ValidateIf, ValidationOptions } from 'class-validator';

export function ValidateIfExists(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateIf((_, value) => value !== undefined, validationOptions);
}
