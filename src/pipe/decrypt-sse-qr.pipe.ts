import { ISseQr } from '@/interfaces/sse-qr.interface';
import { UtilityService } from '@/modules/utility/utility.service';
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class DecryptSseQrPipe implements PipeTransform {
  constructor(private utilityService: UtilityService) {}

  transform(value: string, metadata: ArgumentMetadata) {
    if (!value) throw new BadRequestException();
    return JSON.parse(this.utilityService.decrypt(value)) as ISseQr;
  }
}
