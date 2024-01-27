import { Reward } from '@/modules/db/schemas/reward.schema';
import { RewardService as DbRewardService } from '@/modules/db/services/reward.service';
import { Injectable } from '@nestjs/common';
import { CreateRewardDto } from './dtos/create-reward.dto';
import { GetRewardsDto } from './dtos/get-rewards.dto';
import { UtilityService } from '@/modules/utility/utility.service';
import { FastifyRequest } from 'fastify';

@Injectable()
export class RewardService {
  constructor(
    private dbRewardService: DbRewardService,
    private utilityService: UtilityService,
  ) {}

  async createNew(
    createRewardDto: CreateRewardDto,
    businessId: string,
  ): Promise<Reward> {
    return this.dbRewardService.create({
      business: businessId,
      type: createRewardDto.type,
      title: createRewardDto.title,
      timeLimit: createRewardDto.timeLimit,
      tc: createRewardDto.tc,
      ...(createRewardDto.amountPerX && {
        amountPerX: createRewardDto.amountPerX,
      }),
      ...(createRewardDto.guide && { guide: createRewardDto.guide }),
      ...(createRewardDto.startDate && {
        startDate: createRewardDto.startDate,
      }),
      ...(createRewardDto.endDate && { endDate: createRewardDto.endDate }),
    });
  }

  async getPaginatedList(
    filters: GetRewardsDto,
    req: FastifyRequest,
  ): Promise<{
    data: Reward[];
    total: number;
    prev: string;
    next: string;
    final: boolean;
  }> {
    let data: Reward[];
    let final = false;

    if (filters.next || filters.page == 1) {
      data = await this.dbRewardService.findMany(filters, filters.limit + 1, {
        createdAt: -1,
      });

      final = data.length <= filters.limit;

      // check if exceed limit
      if (data.length > filters.limit) {
        data.pop();
      }
    } else {
      data = await this.dbRewardService.findMany(filters, filters.limit, {
        createdAt: -1,
      });
    }

    return {
      data: data,
      total: filters.page == 1 ? await this.getCount(filters) : 0,
      // create paginate link
      ...this.utilityService.createPaginateLink(data, req, filters, final),
      final: final,
    };
  }

  async getCount(filters: GetRewardsDto): Promise<number> {
    return this.dbRewardService.count(filters);
  }

  async getOne(rewardId: string): Promise<Reward> {
    return this.dbRewardService.findOne({ _id: rewardId });
  }
}
