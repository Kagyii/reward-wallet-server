import { IsAlphanumeric, IsString, Length } from 'class-validator';

export class CreateBusinessUserDto {
  @IsString()
  @Length(1, 20)
  name: string;

  @IsString()
  @IsAlphanumeric()
  @Length(4, 20)
  username: string;

  @IsString()
  @IsAlphanumeric()
  @Length(6, 20)
  password: string;
}
