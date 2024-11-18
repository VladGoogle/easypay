import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { map } from 'lodash';

interface UniqueByOptions {
  byProperty?: string;
}

@ValidatorConstraint({ name: 'hasUniqueItems', async: false })
export class HasUniqueItemsConstraint implements ValidatorConstraintInterface {
  public validate(value: any[], args: ValidationArguments): boolean {
    const options = (args.constraints[0] as UniqueByOptions) ?? {};
    return new Set(map(value, options.byProperty)).size === value.length;
  }

  public defaultMessage(args: ValidationArguments): string {
    return `${args.property} should have unique values`;
  }
}

export function HasUniqueItems(
  options?: UniqueByOptions,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (
    object: Record<string, unknown>,
    propertyName: string,
  ): void {
    registerDecorator({
      name: 'HasUniqueItems',
      target: object.constructor,
      propertyName,
      constraints: [options],
      options: validationOptions,
      validator: HasUniqueItemsConstraint,
    });
  } as PropertyDecorator;
}
