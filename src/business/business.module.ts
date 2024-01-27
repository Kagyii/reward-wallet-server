import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { CustomerModule } from './modules/customer/customer.module';
import { BusinessUserModule } from './modules/business-user/business-user.module';
import { RewardModule } from './modules/reward/reward.module';
import { CustomerRewardModule } from './modules/customer-reward/customer-reward.module';

@Module({
  imports: [
    AuthModule,
    BusinessUserModule,
    CustomerModule,
    RewardModule,
    CustomerRewardModule,
  ],
})
export class BusinessModule {}
