import { UserGuard } from '@/business/guards/user.guard';
import { IResponse } from '@/interfaces/response.interface';
import { ISseQr } from '@/interfaces/sse-qr.interface';
import { DecryptSseQrPipe } from '@/pipe/decrypt-sse-qr.pipe';
import {
  Body,
  Controller,
  ForbiddenException,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CustomerRewardService } from './customer-reward.service';
import { OfferRewardDto } from './dtos/offer-reward.dto';
import { AuthUser } from '@/decorators/auth-user.decorator';
import { BusinessUser } from '@/modules/db/schemas/business-user.schema';
import { ApplyRewardDto } from './dtos/apply-reward.dto';

@Controller('business/customer-reward')
@UseGuards(UserGuard)
export class CustomerRewardController {
  constructor(private customerRewardService: CustomerRewardService) {}

  @Put('/offer')
  async offer(
    @Body() offerRewardDto: OfferRewardDto,
    @Body('qrData', DecryptSseQrPipe) sseQr: ISseQr,
    @AuthUser() businessUser: BusinessUser,
  ): Promise<IResponse> {
    await this.customerRewardService.offerReward(
      sseQr.key,
      sseQr.userId,
      businessUser.business.toString(),
      offerRewardDto.rewardId,
      offerRewardDto.xCount,
    );
    return {
      message: 'Success',
      data: {},
    };
  }

  @Put('/apply')
  async apply(
    @Body() applyRewardDto: ApplyRewardDto,
    @Body('qrData', DecryptSseQrPipe) sseQr: ISseQr,
    @AuthUser() businessUser: BusinessUser,
  ): Promise<IResponse> {
    if (applyRewardDto.rewardId != sseQr.rewardId) {
      throw new ForbiddenException('Apply to different reward');
    }

    await this.customerRewardService.applyReward(
      sseQr.key,
      sseQr.customerId,
      businessUser.business.toString(),
      applyRewardDto.rewardId,
      applyRewardDto.xCount,
    );
    return {
      message: 'Success',
      data: {},
    };
  }
}
