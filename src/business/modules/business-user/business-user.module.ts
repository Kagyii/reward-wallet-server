import { Module } from '@nestjs/common';
import { BusinessUserController } from './business-user.controller';
import { BusinessUserService } from './business-user.service';

@Module({
  controllers: [BusinessUserController],
  providers: [BusinessUserService],
})
export class BusinessUserModule {}
