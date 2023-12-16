import { BusinessService } from '@/modules//db/services/business.service';
import {
  BUSINESS_SCHEMA_NAME,
  BusinessSchema,
} from '@/modules/db/schemas/business.schema';
import { USER_SCHEMA_NAME, UserSchema } from '@/modules/db/schemas/user.schema';
import { UserService } from '@/modules/db/services/user.service';
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BUSINESS_CUSTOMER_SCHEMA_NAME,
  BusinessCustomerSchema,
} from './schemas/business-customer.schema';
import {
  BUSINESS_USER_SCHEMA_NAME,
  BusinessUserSchema,
} from './schemas/business-user.schema';
import {
  CUSTOMER_REWARD_SCHEMA_NAME,
  CustomerRewardSchema,
} from './schemas/customer-reward.schema';
import { REWARD_SCHEMA_NAME, RewardSchema } from './schemas/reward.schema';
import { BusinessCustomerService } from './services/business-customer.service';
import { BusinessUserService } from './services/business-user.service';
import { CustomerRewardService } from './services/customer-reward.service';
import { RewardService } from './services/reward.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_SCHEMA_NAME, schema: UserSchema },
      { name: BUSINESS_SCHEMA_NAME, schema: BusinessSchema },
      { name: BUSINESS_USER_SCHEMA_NAME, schema: BusinessUserSchema },
      { name: BUSINESS_CUSTOMER_SCHEMA_NAME, schema: BusinessCustomerSchema },
      { name: REWARD_SCHEMA_NAME, schema: RewardSchema },
      { name: CUSTOMER_REWARD_SCHEMA_NAME, schema: CustomerRewardSchema },
    ]),
  ],
  providers: [
    UserService,
    BusinessService,
    BusinessUserService,
    BusinessCustomerService,
    RewardService,
    CustomerRewardService,
  ],
  exports: [
    UserService,
    BusinessService,
    BusinessUserService,
    BusinessCustomerService,
    RewardService,
    CustomerRewardService,
  ],
})
export class DbModule {}
