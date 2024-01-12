import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { MemoryStorageFile } from '@blazity/nest-file-fastify';
import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService implements OnModuleInit {
  private s3: S3Client;
  private bucket!: string;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.s3 = new S3Client({
      region: this.configService.get<string>('STORAGE_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ID'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET'),
      },
    });

    this.bucket = this.configService.get<string>('STORAGE_BUCKET');
  }

  // constructor(private readonly configService: ConfigService) {
  //   this.s3 = new S3Client({
  //     region: 'ap-southeast-1',
  //     // endpoint: configService.get<string>('STORAGE_END_POINT'),
  //     credentials: {
  //       accessKeyId: configService.get<string>('STORAGE_ID'),
  //       secretAccessKey: configService.get<string>('STORAGE_SECRET'),
  //     },
  //   });

  //   this.bucket = configService.get<string>('STORAGE_BUCKET');
  // }

  async upload(file: MemoryStorageFile, filePath: string): Promise<void> {
    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: filePath,
          Body: file.buffer,
          ContentType: file.mimetype,
          ContentDisposition: 'inline',
        }),
      );

      console.log('Successfully Uploaded');
    } catch (error) {
      throw new InternalServerErrorException('File upload fail');
    }
  }
}
