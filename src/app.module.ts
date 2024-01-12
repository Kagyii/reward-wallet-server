import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { CacheModule } from '@nestjs/cache-manager';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { BusinessModule } from './business/business.module';
import { EndUserModule } from './end-user/end-user.module';
import { DbModule } from './modules/db/db.module';
import { OtpModule } from './modules/otp/otp.module';
import { StorageModule } from './modules/storage/storage.module';
import { UtilityModule } from './modules/utility/utility.module';
import { UtilityService } from './modules/utility/utility.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SseModule } from './modules/sse/sse.module';
import { FirebaseModule } from './modules/firebase/firebase.module';

const NODE_ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${NODE_ENV}`,
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_DB_CONNECTION_STRING'),
      }),
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    // JwtModule.registerAsync({
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     global: true,
    //     secret: configService.get<string>('JWT_SECRET'),
    //   }),
    // }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, //millisecond
        limit: 60,
      },
    ]),
    MailerModule.forRoot({
      transport: {
        host: 'email-smtp.ap-southeast-1.amazonaws.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.AWS_ID,
          pass: process.env.MAIL_SECRET,
        },
      },
      defaults: {
        from: 'no-reply@rewardwallet.net',
      },
      template: {
        dir: join(__dirname, '..', '/templates/mails/'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    EventEmitterModule.forRoot(),
    // {
    //   ...HttpModule.register({}),
    //   global: true,
    // },
    StorageModule,
    DbModule,
    EndUserModule,
    BusinessModule,
    OtpModule,
    AdminModule,
    UtilityModule,
    SseModule,
    FirebaseModule,
  ],
  providers: [
    Logger,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  controllers: [AppController],
})
export class AppModule implements OnModuleInit {
  constructor(private utilityService: UtilityService) {}

  onModuleInit() {}
}
