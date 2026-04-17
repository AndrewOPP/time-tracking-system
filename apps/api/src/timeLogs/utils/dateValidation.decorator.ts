import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsValidDateRangeConstraint } from './dateRange.validator';

export function IsValidDateRange(validationOptions?: ValidationOptions): ClassDecorator {
  return (target): void => {
    registerDecorator({
      name: 'IsValidDateRange',
      target,
      propertyName: undefined as unknown as string,
      options: validationOptions,
      validator: IsValidDateRangeConstraint,
    });
  };
}
