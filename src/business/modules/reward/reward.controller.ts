import { IResponse } from '@/interfaces/response.interface';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RewardService } from './reward.service';
import { CreateRewardDto } from './dtos/create-reward.dto';
import { OwnerGuard } from '@/business/guards/owner.guard';
import { AuthUser } from '@/decorators/auth-user.decorator';
import { Business } from '@/modules/db/schemas/business.schema';

@Controller('business/reward')
@UseGuards(OwnerGuard)
export class RewardController {
  constructor(private rewardService: RewardService) {}

  @Get()
  async list(@Query() query: Record<string, any>): Promise<IResponse> {
    const rewards = await this.rewardService.getList(
      query,
      query?.lastCreatedAt,
    );
    return {
      message: 'Successfully retrieved',
      data: rewards,
    };
  }

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

  @Get(':id')
  async show(@Param('id') id: string): Promise<IResponse> {
    const reward = await this.rewardService.getOne(id);
    return {
      message: 'Successfully retrieved',
      data: reward,
    };
  }

  @Put(':id')
  async update(): Promise<IResponse> {
    return {
      message: '',
      data: {},
    };
  }
}
