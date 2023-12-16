import { IsMongoId, IsNumber, IsPositive, IsString } from 'class-validator';

export class ApplyRewardDto {
  @IsString()
  qrData: string;

  @IsMongoId()
  rewardId: string;

  @IsNumber()
  @IsPositive()
  xCount: number;
}
