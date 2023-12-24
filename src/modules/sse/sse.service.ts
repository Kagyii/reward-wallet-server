import { SSE_STATUS } from '@/config/sse-status.config';
import {
  GoneException,
  Injectable,
  MessageEvent,
  OnModuleInit,
} from '@nestjs/common';
import { toBuffer } from 'qrcode';
import {
  BehaviorSubject,
  Observable,
  from,
  switchMap,
  take,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import { UtilityService } from '../utility/utility.service';

@Injectable()
export class SseService implements OnModuleInit {
  private readonly exp = 60;

  private clients: Map<string, BehaviorSubject<MessageEvent>>;

  constructor(private utilityService: UtilityService) {}

  onModuleInit() {
    this.clients = new Map();
  }

  getClient(key: string): BehaviorSubject<MessageEvent> {
    const client = this.clients.get(key);
    if (!client) throw new GoneException();

    return client;
  }

  addClient(data: Record<string, any> & { key: string }): Observable<any> {
    data.timestamp = new Date().getTime();
    const encryptedData = this.utilityService.encrypt(JSON.stringify(data));

    console.log(encryptedData);

    return from(toBuffer(encryptedData)).pipe(
      take(1),
      tap((qrCode) => {
        const client = new BehaviorSubject<MessageEvent>({
          data: {
            status: SSE_STATUS.PENDING,
            qrCode: qrCode.toString('base64'),
            exp: this.exp,
          },
        });
        this.clients.set(data.key, client);
      }),
    );
  }

  completeRemoveClient(key: string): void {
    const client = this.getClient(key);
    client.complete();
    this.clients.delete(key);
  }

  emitCompleteRemoveClient(key: string, data: any): void {
    const client = this.getClient(key);
    client.next(data);
    client.complete();
    this.clients.delete(key);
  }

  watchClient(key: string): Observable<any> {
    return timer(0, this.exp * 1000).pipe(
      take(1),
      switchMap(() => this.clients.get(key)),
      takeUntil(timer(this.exp * 1000)),
    );
  }
}
