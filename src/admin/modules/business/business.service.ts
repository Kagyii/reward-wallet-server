import { PATHS } from '@/config/storage-path.config';
import { BusinessService as DbBusinessService } from '@/modules/db/services/business.service';
import { StorageService } from '@/modules/storage/storage.service';
import { UtilityService } from '@/modules/utility/utility.service';
import { Injectable } from '@nestjs/common';
import { CreateBusinessDto } from './dtos/create-business.dto';
import { Business } from '@/modules/db/schemas/business.schema';
import * as bcrypt from 'bcrypt';
import { MemoryStorageFile } from '@blazity/nest-file-fastify';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BusinessService {
  constructor(
    private dbBusinessService: DbBusinessService,
    private storageService: StorageService,
    private utilityService: UtilityService,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async createNewBusiness(
    createBusinessDto: CreateBusinessDto,
    file: MemoryStorageFile,
    password: string,
  ): Promise<Business> {
    const filePath = PATHS.BUSINESS_LOGO + this.utilityService.generateRandom();

    this.storageService.upload(file, filePath);

    const hashPassword = await bcrypt.hash(password, 10);

    return this.dbBusinessService.create({
      username: createBusinessDto.username,
      password: hashPassword,
      name: createBusinessDto.name,
      email: createBusinessDto.email,
      phones: [createBusinessDto.phone],
      logo: filePath,
    });
  }

  async sendBusinessCreatedMail(
    to: string,
    subject: string,
    context: { name: string; username: string; password: string },
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: to,
      subject: subject,
      template: 'business-created',
      context: {
        ...context,
        ...{ appUrl: this.configService.get<string>('APP_URL') },
      },
    });
  }
}
