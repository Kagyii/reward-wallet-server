import { PhoneNumberValidator } from '@/validators/phone-number.validator';
import {
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
  Validate,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Validate(PhoneNumberValidator)
  phone: string;

  @IsString()
  @MaxLength(30)
  name: string;

  @IsDateString()
  dateOfBirth: string;
}
