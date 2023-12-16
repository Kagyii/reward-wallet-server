import { IsString, Validate } from 'class-validator';
import { PhoneNumberValidator } from '@/validators/phone-number.validator';

export class RequestOtpDto {
  @IsString()
  @Validate(PhoneNumberValidator)
  phone: string;
}
