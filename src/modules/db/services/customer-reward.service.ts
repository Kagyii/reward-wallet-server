import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CUSTOMER_REWARD_SCHEMA_NAME,
  CustomerReward,
} from '../schemas/customer-reward.schema';
import { Model } from 'mongoose';

@Injectable()
export class CustomerRewardService {
  constructor(
    @InjectModel(CUSTOMER_REWARD_SCHEMA_NAME)
    private customerRewardModel: Model<CustomerReward>,
  ) {}

  async getOrCreate(
    customerId: string,
    rewardId: string,
  ): Promise<CustomerReward> {
    let customerReward = await this.customerRewardModel
      .findOne({
        businessCustomer: customerId,
        reward: rewardId,
      })
      .exec();

    if (!customerReward) {
      customerReward = await new this.customerRewardModel({
        businessCustomer: customerId,
        reward: rewardId,
        xCount: 0,
      }).save();
    }

    return customerReward;
  }

  async findOne(
    filter: Record<string, any>,
    populates: Array<Record<string, any> & { path: string }> = [],
    select: Record<string, any> = {},
  ): Promise<CustomerReward> {
    const query = this.customerRewardModel.findOne(filter);

    populates.forEach((populate) => {
      query.populate(populate);
    });

    query.select(select).lean();

    return query;
  }

  async updateById(
    id: string,
    data: Record<string, any>,
  ): Promise<CustomerReward> {
    return this.customerRewardModel.findByIdAndUpdate(id, data).exec();
  }
}
