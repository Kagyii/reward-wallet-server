import { Injectable } from '@nestjs/common';
import { REWARD_SCHEMA_NAME, Reward } from '../schemas/reward.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RewardService {
  constructor(
    @InjectModel(REWARD_SCHEMA_NAME)
    private rewardModel: Model<Reward>,
  ) {}

  async create(user: Record<string, any>): Promise<Reward> {
    return new this.rewardModel(user).save();
  }

  async findOne(
    filter: Record<string, any>,
    populates: Array<Record<string, any> & { path: string }> = [],
    select: Record<string, any> = {},
  ): Promise<Reward> {
    const query = this.rewardModel.findOne(filter);

    populates.forEach((populate) => {
      query.populate(populate);
    });

    query.select(select).lean();

    return query;
  }
}
