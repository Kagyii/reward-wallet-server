import { Module } from '@nestjs/common';
import { BusinessModule } from './modules/business/business.module';

@Module({
  imports: [BusinessModule],
})
export class AdminModule {}
