import { Reward } from '@/modules/db/schemas/reward.schema';
import { RewardService as DbRewardService } from '@/modules/db/services/reward.service';
import { Injectable } from '@nestjs/common';
import { CreateRewardDto } from './dtos/create-reward.dto';

@Injectable()
export class RewardService {
  constructor(private dbRewardService: DbRewardService) {}

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
}
