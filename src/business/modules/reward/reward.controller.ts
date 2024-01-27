import { OwnerGuard } from '@/business/guards/owner.guard';
import { AuthUser } from '@/decorators/auth-user.decorator';
import { IResponse } from '@/interfaces/response.interface';
import { Business } from '@/modules/db/schemas/business.schema';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { CreateRewardDto } from './dtos/create-reward.dto';
import { GetRewardsDto } from './dtos/get-rewards.dto';
import { RewardService } from './reward.service';

@Controller('business/reward')
@UseGuards(OwnerGuard)
export class RewardController {
  constructor(private rewardService: RewardService) {}

  @Get()
  async list(
    @Query() getRewardsDto: GetRewardsDto,
    @Req() req: FastifyRequest,
  ): Promise<IResponse> {
    const paginatedData = await this.rewardService.getPaginatedList(
      getRewardsDto,
      req,
    );

    return {
      message: 'Successfully retrieved',
      data: paginatedData.data,
      meta: {
        total: paginatedData.total,
        prev: paginatedData.prev,
        next: paginatedData.next,
        final: paginatedData.final,
      },
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
