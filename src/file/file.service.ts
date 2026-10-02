import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { AllConfigType } from '../config/config.type';

export interface UploadedFileResponse {
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}

interface DetectedImageType {
  extension: '.jpg' | '.png' | '.gif' | '.webp';
  mimetype: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
}

@Injectable()
export class FileService {
  constructor(private readonly configService: ConfigService<AllConfigType>) {}

  async uploadFile(
    file: Express.Multer.File | undefined,
  ): Promise<UploadedFileResponse> {
    if (!file?.buffer?.length) {
      throw new BadRequestException('No file uploaded');
    }

    const detectedType = this.detectImageType(file.buffer);
    if (!detectedType) {
      throw new BadRequestException(
        'The uploaded file content is not a supported image',
      );
    }

    const uploadsDirectory = this.configService.getOrThrow(
      'app.uploadsDirectory',
      { infer: true },
    );
    const filename = `${randomUUID()}${detectedType.extension}`;

    await mkdir(uploadsDirectory, { recursive: true });
    await writeFile(join(uploadsDirectory, filename), file.buffer, {
      flag: 'wx',
    });

    return {
      url: `/uploads/${filename}`,
      filename,
      mimetype: detectedType.mimetype,
      size: file.size,
    };
  }

  async uploadFiles(
    files: Express.Multer.File[] | undefined,
  ): Promise<UploadedFileResponse[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    return Promise.all(files.map((file) => this.uploadFile(file)));
  }

  private detectImageType(buffer: Buffer): DetectedImageType | null {
    if (
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff
    ) {
      return { extension: '.jpg', mimetype: 'image/jpeg' };
    }

    if (
      buffer.length >= 8 &&
      buffer
        .subarray(0, 8)
        .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    ) {
      return { extension: '.png', mimetype: 'image/png' };
    }

    const header = buffer.subarray(0, 12).toString('ascii');
    if (header.startsWith('GIF87a') || header.startsWith('GIF89a')) {
      return { extension: '.gif', mimetype: 'image/gif' };
    }

    if (header.startsWith('RIFF') && header.slice(8, 12) === 'WEBP') {
      return { extension: '.webp', mimetype: 'image/webp' };
    }

    return null;
  }
}
