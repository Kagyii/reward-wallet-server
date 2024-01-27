import { AuthUser } from '@/decorators/auth-user.decorator';
import { User } from '@/modules/db/schemas/user.schema';
import { SseService } from '@/modules/sse/sse.service';
import { Controller, Query, Sse, UseGuards } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable } from 'rxjs';
import { QrService } from './qr.service';
import { AuthGuard } from '@/end-user/guards/auth.guard';

@Controller('end-user/qr')
@UseGuards(AuthGuard)
export class QrController {
  constructor(
    private qrService: QrService,
    private sseService: SseService,
  ) {}

  @Sse('subscribe')
  get(
    @AuthUser() user: User,
    @Query() query: Record<string, any>,
  ): Observable<MessageEvent> {
    const uniqueKey = randomUUID();

    const obs = this.qrService.getQrObs({
      ...{
        key: uniqueKey,
        userId: user._id.toString(),
      },
      ...query,
    });

    obs.subscribe({
      complete: () => {
        console.log('complete');
        this.sseService.completeRemoveClient(uniqueKey);
      },
    });

    return obs;
  }
}
