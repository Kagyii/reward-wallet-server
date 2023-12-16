import { IResponse } from '@/interfaces/response.interface';
import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { RewardService } from './reward.service';
import { CreateRewardDto } from './dtos/create-reward.dto';
import { OwnerGuard } from '@/business/guards/owner.guard';
import { AuthUser } from '@/decorators/auth-user.decorator';
import { Business } from '@/modules/db/schemas/business.schema';

@Controller('business/reward')
@UseGuards(OwnerGuard)
export class RewardController {
  constructor(private rewardService: RewardService) {}

  @Post()
  async create(
    @Body() createRewardDto: CreateRewardDto,
    @AuthUser() business: Business,
  ): Promise<IResponse> {
    const reward = await this.rewardService.createNew(
      createRewardDto,
      business._id.toString(),
    );
    return {
      message: 'Successfully created',
      data: reward,
    };
  }

  @Put()
  async update(): Promise<IResponse> {
    return {
      message: '',
      data: {},
    };
  }
}
