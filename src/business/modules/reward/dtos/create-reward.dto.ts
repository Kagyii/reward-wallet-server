import { REWARD_TYPE } from '@/config/reward-type.config';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class CreateRewardDto {
  @IsString()
  @IsIn(Object.values(REWARD_TYPE))
  type: string;

  @IsString()
  @MaxLength(100)
  title: string;

  @IsString()
  tc: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  guide: string;

  @IsBoolean()
  timeLimit: boolean;

  @ValidateIf((req) => req.timeLimit == true)
  @IsDateString()
  startDate: Date;

  @ValidateIf((req) => req.timeLimit == true)
  @IsDateString()
  endDate: Date;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  amountPerX: number;
}
