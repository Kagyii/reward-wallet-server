import { PaginationDto } from '@/business/dtos/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class GetBusinessUsersDto extends PaginationDto {
  @IsOptional()
  @IsString()
  name?: string;
}
