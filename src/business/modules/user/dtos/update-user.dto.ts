import { IsAlphanumeric, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(1, 20)
  name: string;

  @IsString()
  @IsAlphanumeric()
  @Length(6, 20)
  password: string;
}
