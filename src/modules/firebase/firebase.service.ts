import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  App as FirebaseApp,
  ServiceAccount,
  cert,
  initializeApp,
} from 'firebase-admin/app';
import * as serviceAccount from '../../../firebase-secret.json';
import { Messaging, getMessaging } from 'firebase-admin/messaging';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp: FirebaseApp;
  private messaging: Messaging;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.firebaseApp = initializeApp(
      {
        credential: cert(serviceAccount as ServiceAccount),
      },
      this.configService.get('FIREBASE_APP_NAME'),
    );

    this.messaging = getMessaging(this.firebaseApp);
  }

  getFirebaseApp() {
    return this.firebaseApp;
  }

  getMessaging() {
    return this.messaging;
  }
}
