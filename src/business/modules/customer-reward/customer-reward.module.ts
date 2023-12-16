import { Module } from '@nestjs/common';
import { CustomerRewardController } from './customer-reward.controller';
import { CustomerRewardService } from './customer-reward.service';

@Module({
  controllers: [CustomerRewardController],
  providers: [CustomerRewardService],
})
export class CustomerRewardModule {}
