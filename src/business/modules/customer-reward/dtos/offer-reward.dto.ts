import { IsMongoId, IsNumber, IsPositive, IsString } from 'class-validator';

export class OfferRewardDto {
  @IsString()
  qrData: string;

  @IsMongoId()
  rewardId: string;

  @IsNumber()
  @IsPositive()
  xCount: number;
}
