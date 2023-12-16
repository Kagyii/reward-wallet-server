import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { CustomerModule } from './modules/customer/customer.module';
import { UserModule } from './modules/user/user.module';
import { RewardModule } from './modules/reward/reward.module';
import { CustomerRewardModule } from './modules/customer-reward/customer-reward.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CustomerModule,
    RewardModule,
    CustomerRewardModule,
  ],
})
export class BusinessModule {}
