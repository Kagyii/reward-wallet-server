import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OtpService } from './otp.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get<string>('SMSPOH_ENDPOINT'),
        headers: {
          Authorization: `Bearer ${configService.get<string>('SMSPOH_TOKEN')}`,
        },
      }),
    }),
  ],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
