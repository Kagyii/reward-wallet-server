import { SSE_STATUS } from '@/config/sse-status.config';
import { SSE_TYPE } from '@/config/sse-type.config';
import { BusinessCustomerService as DbBusinessCustomerService } from '@/modules/db/services/business-customer.service';
import { CustomerRewardService as DbCustomerRewardService } from '@/modules/db/services/customer-reward.service';
import { RewardService as DbRewardService } from '@/modules/db/services/reward.service';
import { SseService } from '@/modules/sse/sse.service';
import {
  ForbiddenException,
  GoneException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class CustomerRewardService {
  constructor(
    private sseService: SseService,
    private dbBusinessCustomerService: DbBusinessCustomerService,
    private dbCustomerRewardService: DbCustomerRewardService,
    private dbRewardService: DbRewardService,
    @InjectConnection() private dbConnection: Connection,
  ) {}

  async offerReward(
    sseClientKey: string,
    userId: string,
    businessId: string,
    rewardId: string,
    xCount: number,
  ): Promise<void> {
    const dbSession = await this.dbConnection.startSession();
    try {
      dbSession.startTransaction();
      let businessCustomer = await this.dbBusinessCustomerService.getOrCreate(
        businessId,
        userId,
      );

      businessCustomer = await this.dbBusinessCustomerService.updateById(
        businessCustomer._id.toString(),
        {
          $addToSet: { rewards: rewardId },
        },
      );

      const customerReward = await this.dbCustomerRewardService.getOrCreate(
        businessCustomer._id.toString(),
        rewardId,
      );

      this.dbCustomerRewardService.updateById(customerReward._id.toString(), {
        $inc: { xCount: xCount },
      });

      this.sseService.emitCompleteRemoveClient(sseClientKey, {
        data: {
          status: SSE_STATUS.SUCCESS,
          type: SSE_TYPE.REWARD,
          customerRewardId: customerReward._id,
        },
      });
      dbSession.commitTransaction();
    } catch (error) {
      dbSession.abortTransaction();
      dbSession.endSession();

      if (error instanceof GoneException) throw error;

      throw new InternalServerErrorException();
    }
  }

  async applyReward(
    sseClientKey: string,
    customerId: string,
    businessId: string,
    rewardId: string,
    xCount: number,
  ): Promise<void> {
    const dbSession = await this.dbConnection.startSession();
    try {
      dbSession.startTransaction();

      const reward = await this.dbRewardService.findOne({ _id: rewardId }, [], {
        business: 1,
      });

      if (reward.business.toString() != businessId)
        throw new ForbiddenException('Not own by current business');

      const customerReward = await this.dbCustomerRewardService.findOne({
        businessCustomer: customerId,
        reward: rewardId,
      });
      console.log(customerReward.xCount - xCount < 0);

      if (customerReward.xCount - xCount < 0)
        throw new ForbiddenException('Not enough xCount');

      this.dbCustomerRewardService.updateById(customerReward._id.toString(), {
        $inc: { xCount: -xCount },
      });

      this.sseService.emitCompleteRemoveClient(sseClientKey, {
        data: {
          status: SSE_STATUS.SUCCESS,
          type: SSE_TYPE.REWARD,
          customerRewardId: customerReward._id,
        },
      });
      dbSession.commitTransaction();
    } catch (error) {
      dbSession.abortTransaction();
      dbSession.endSession();

      if (error instanceof ForbiddenException) throw error;

      throw new InternalServerErrorException();
    }
  }
}
