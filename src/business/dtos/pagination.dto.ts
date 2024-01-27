import { IsDateString, IsIn, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsDateString()
  prev: string;

  @IsOptional()
  @IsDateString()
  next: string;

  @IsIn([5, 10, 20])
  limit: number;

  @IsPositive()
  page: number;
}
