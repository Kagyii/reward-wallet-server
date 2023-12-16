import { ValidateIf, IsIn, IsString, Length, Validate } from 'class-validator';
import { AUTHENTICATE_METHODS } from '@/end-user/configs/auth-method.config';
import { PhoneNumberValidator } from '@/validators/phone-number.validator';

export class AuthenticateDto {
  @IsIn(Object.values(AUTHENTICATE_METHODS))
  authMethod: string;

  @ValidateIf((req) => req.authMethod == AUTHENTICATE_METHODS.PHONE)
  @IsString()
  @Validate(PhoneNumberValidator)
  phone: string;

  @ValidateIf((req) => req.authMethod == AUTHENTICATE_METHODS.PHONE)
  @IsString()
  @Length(6, 6)
  otp: string;

  @ValidateIf((req) =>
    [AUTHENTICATE_METHODS.GOOGLE, AUTHENTICATE_METHODS.FACEBOOK].includes(
      req.authMethod,
    ),
  )
  oauthToken: string;
}
