import { Global, Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { PushNotiService } from './push-noti.service';

@Global()
@Module({
  providers: [FirebaseService, PushNotiService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
