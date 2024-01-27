import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyRequest } from 'fastify';
import { Buffer } from 'node:buffer';
import {
  createCipheriv,
  createDecipheriv,
  getRandomValues,
  randomUUID,
} from 'node:crypto';
import { URL } from 'node:url';

@Injectable()
export class UtilityService {
  constructor(private configService: ConfigService) {}

  generateRandom(): string {
    const encoder = new TextEncoder();

    const uint8Array = getRandomValues(encoder.encode(randomUUID()));

    return Array.from(uint8Array, (byte) =>
      byte.toString(16).padStart(2, '0'),
    ).join('');
  }

  extractBearerToken(request: FastifyRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  encrypt(data: string): string {
    const cipher = createCipheriv(
      'aes-256-ctr',
      Buffer.from(this.configService.get<string>('ED_KEY'), 'hex'),
      Buffer.from(this.configService.get<string>('ED_VI'), 'hex'),
    );
    return Buffer.concat([cipher.update(data), cipher.final()]).toString('hex');
  }

  decrypt(data: string): string {
    const decipher = createDecipheriv(
      'aes-256-ctr',
      Buffer.from(this.configService.get<string>('ED_KEY'), 'hex'),
      Buffer.from(this.configService.get<string>('ED_VI'), 'hex'),
    );

    return Buffer.concat([
      decipher.update(Buffer.from(data, 'hex')),
      decipher.final(),
    ]).toString('utf-8');
  }

  createPaginateLink(
    list: Record<string, any>[],
    req: FastifyRequest,
    query: Record<string, any>,
    final: boolean,
  ): { prev: string; next: string } {
    const currentPage = query.page;
    let nextUrl = null;
    let prevUrl = null;

    if (currentPage > 1) {
      prevUrl = new URL(req.url, this.configService.get<string>('APP_URL'));
      prevUrl.searchParams.set('prev', list[0].createdAt.toISOString());
      prevUrl.searchParams.set('page', currentPage - 1);
      prevUrl.searchParams.delete('next');
      prevUrl = prevUrl.toString();
    }

    if (!final) {
      nextUrl = new URL(req.url, this.configService.get<string>('APP_URL'));
      nextUrl.searchParams.set(
        'next',
        list[list.length - 1].createdAt.toISOString(),
      );
      nextUrl.searchParams.set('page', currentPage + 1);
      nextUrl.searchParams.delete('prev');
      nextUrl = nextUrl.toString();
    }

    return {
      prev: prevUrl,
      next: nextUrl,
    };
  }
}
