import { IsString } from 'class-validator';

export class OwnerAuthDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
