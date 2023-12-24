import { Injectable } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Injectable()
export class PushNotiService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async sendPushNoti(data: Record<string, any>) {
    this.firebaseService.getMessaging().send({
      topic: '',
      data: data,
      notification: {
        title: 'Match update',
        body: 'Arsenal goal in added time, score is now 3-0',
      },
      android: {
        priority: 'high',
      },
      apns: {
        headers: {
          'apns-priority': '10',
        },
      },
      fcmOptions: {},
    });
  }

  async subscribeToTopic(token: string, topic: string) {
    await this.firebaseService.getMessaging().subscribeToTopic(token, topic);
  }

  async unsubscribeFromTopic(token: string, topic: string) {
    await this.firebaseService
      .getMessaging()
      .unsubscribeFromTopic(token, topic);
  }
}
