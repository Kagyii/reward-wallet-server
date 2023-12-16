import { Module } from '@nestjs/common';
import { AuthModule } from '@end-user/modules/auth/auth.module';
import { BusinessModule } from './modules/business/business.module';
import { QrCodeModule } from './modules/qr-code/qr.module';
import { ProfileModule } from './modules/profile/profile.module';

@Module({
  imports: [AuthModule, BusinessModule, QrCodeModule, ProfileModule],
})
export class EndUserModule {}
