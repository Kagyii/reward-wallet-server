import {
  GetObjectCommand,
  S3Client,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { MemoryStorageFile } from '@blazity/nest-file-fastify';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private s3: S3Client;
  private bucket!: string;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: configService.get<string>('STORAGE_END_POINT'),
      credentials: {
        accessKeyId: configService.get<string>('STORAGE_ID'),
        secretAccessKey: configService.get<string>('STORAGE_SECRET'),
      },
    });

    this.bucket = configService.get<string>('STORAGE_BUCKET');
  }

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
    } catch (error) {
      throw new InternalServerErrorException('File upload fail');
    }
  }

  async getUrl(path: string): Promise<string> {
    return getSignedUrl(
      this.s3,
      new GetObjectCommand({ Bucket: this.bucket, Key: path }),
      { expiresIn: 86400 }, //second
    );
  }
}
