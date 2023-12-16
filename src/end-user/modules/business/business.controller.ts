import { AuthGuard } from '@/end-user/guards/auth.guard';
import { IResponse } from '@/interfaces/response.interface';
import { SseService } from '@/modules/sse/sse.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { BusinessService } from './business.service';

@Controller('end-user/business')
@UseGuards(AuthGuard)
export class BusinessController {
  constructor(
    private businessService: BusinessService,
    private sseService: SseService,
  ) {}

  @Get()
  async test(): Promise<void> {}
}
