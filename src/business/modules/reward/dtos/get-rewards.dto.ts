import { PaginationDto } from '@/business/dtos/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class GetRewardsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  title?: string;
}
