import { Injectable } from '@nestjs/common';
import { REWARD_SCHEMA_NAME, Reward } from '../schemas/reward.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';

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

  async findMany(
    filters: Record<string, any> = {},
    limit: number = 10,
    sort: Record<string, SortOrder> = { createdAt: -1 },
    populates: Array<Record<string, any> & { path: string }> = [],
    select: Record<string, any> = {},
  ): Promise<Reward[]> {
    return this.rewardModel
      .find(this.getFilters(filters))
      .limit(limit)
      .sort(sort)
      .lean();
  }

  async count(filters: Record<string, any> = {}): Promise<number> {
    return this.rewardModel.countDocuments(this.getFilters(filters)).lean();
  }

  private getFilters(filters: Record<string, any>): Record<string, any> {
    const queryFilter = {};

    // pagination
    if (filters.page && filters.page != 1) {
      if (filters.prev) {
        queryFilter['createdAt'] = { $gt: filters.prev };
      }

      if (filters.next) {
        queryFilter['createdAt'] = { $lt: filters.next };
      }
    }

    if (filters.title) {
      queryFilter['title'] = { $regex: filters.title, $options: 'i' };
    }

    return queryFilter;
  }
}
