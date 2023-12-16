import { IsString } from 'class-validator';

export class UserAuthDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  businessUsername: string;
}
