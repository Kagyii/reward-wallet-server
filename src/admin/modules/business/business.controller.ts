import { IResponse } from '@/interfaces/response.interface';
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { CreateBusinessDto } from './dtos/create-business.dto';
import { BusinessService } from './business.service';
import { StorageService } from '@/modules/storage/storage.service';
import { generate as generatePassword } from 'generate-password';
import {
  FileInterceptor,
  MemoryStorageFile,
  UploadedFile,
} from '@blazity/nest-file-fastify';

@Controller('admin/business')
export class BusinessController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly storageService: StorageService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Body() createBusinessDto: CreateBusinessDto,
    @UploadedFile() logo: MemoryStorageFile,
  ): Promise<IResponse> {
    const password = generatePassword({ length: 10, numbers: true });

    const business = await this.businessService.createNewBusiness(
      createBusinessDto,
      logo,
      password,
    );

    this.businessService.sendBusinessCreatedMail(
      createBusinessDto.email,
      'New business has created at rewardwallet.net',
      {
        name: business.name,
        username: business.username,
        password: password,
      },
    );

    return {
      message: 'New Business has successfully created',
      data: {
        id: business._id,
        username: business.username,
        password: business.password,
        name: business.name,
        email: business.email,
        phone: business.phone,
        logo: await this.storageService.getUrl(business.logo),
      },
    };
  }
}
