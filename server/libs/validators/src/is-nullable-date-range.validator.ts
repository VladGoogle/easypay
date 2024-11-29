import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isDateString,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'isNullableDateRange', async: false })
export class IsNullableDateRangeConstraint
  implements ValidatorConstraintInterface
{
  public validate(value: any): boolean {
    return this.check(value);
  }

  public defaultMessage(args: ValidationArguments): string {
    const { each = false } = args.constraints[0] || ({} as ValidationOptions);
    const str = each ? 'each value in ' : '';

    return `${str}${args.property} must be a valid ISO 8601 date string range`;
  }

  private check(value: any[]): boolean {
    const [from, to] = value;

    if (from === undefined || from === null) {
      return isDateString(to);
    }

    if (to === undefined || to === null) {
      return isDateString(from);
    }

    return isDateString(from) && isDateString(to) && from <= to;
  }
}

export function IsNullableDateRange(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (
    object: Record<string, unknown>,
    propertyName: string,
  ): void {
    registerDecorator({
      name: 'IsNullableDateRange',
      target: object.constructor,
      propertyName,
      constraints: [validationOptions],
      options: validationOptions,
      validator: IsNullableDateRangeConstraint,
    });
  } as PropertyDecorator;
}
