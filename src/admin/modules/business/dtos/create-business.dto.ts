import { PhoneNumberValidator } from '@/validators/phone-number.validator';
import { IsAlphanumeric, IsEmail, IsString, Validate } from 'class-validator';

export class CreateBusinessDto {
  @IsString()
  name: string;

  @IsString()
  @IsAlphanumeric()
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @Validate(PhoneNumberValidator)
  phone: string;
}
