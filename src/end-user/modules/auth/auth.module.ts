import { Module } from '@nestjs/common';
import { AuthController } from '@end-user/modules/auth/auth.controller';
import { AuthService } from '@end-user/modules/auth/auth.service';
import { OtpModule } from '@/modules/otp/otp.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [OtpModule, HttpModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
