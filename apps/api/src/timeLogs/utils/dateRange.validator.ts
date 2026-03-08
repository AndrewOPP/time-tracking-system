import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

interface DateRangeDto {
  from: string;
  to: string;
}

@ValidatorConstraint({ name: 'IsValidDateRange', async: false })
export class IsValidDateRangeConstraint implements ValidatorConstraintInterface {
  validate(_value: unknown, args: ValidationArguments): boolean {
    const dto = args.object as DateRangeDto;

    if (!dto.from || !dto.to) return false;

    const fromDate = new Date(dto.from);
    const toDate = new Date(dto.to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return false;
    }

    if (fromDate > toDate) return false;

    const diffInDays = (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24);

    return diffInDays <= 90;
  }

  defaultMessage(args: ValidationArguments): string {
    const dto = args.object as DateRangeDto;
    if (new Date(dto.from) > new Date(dto.to)) return 'Start date cannot be after end date';
    return 'Date range cannot exceed 90 days';
  }
}
