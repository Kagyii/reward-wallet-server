import { SseService } from '@/modules/sse/sse.service';
import { Injectable } from '@nestjs/common';
import { Observable, concat } from 'rxjs';

@Injectable()
export class QrService {
  constructor(private sseService: SseService) {}

  getQrObs(data: Record<string, any> & { key: string }): Observable<any> {
    const addClientObs = this.sseService.addClient(data);

    const watchClientObs = this.sseService.watchClient(data.key);

    return concat(addClientObs, watchClientObs);
  }
}
