import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
  constructor(private readonly configService: ConfigService) {}

  uploadFile(file: Express.Multer.File): { url: string; filename: string; mimetype: string; size: number } {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const appUrl = this.configService.get<string>('app.frontendDomain') || '';
    // Relative URL works with frontend host or static route /uploads/filename
    const relativeUrl = `/uploads/${file.filename}`;

    return {
      url: relativeUrl,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  uploadFiles(files: Express.Multer.File[]): Array<{ url: string; filename: string; mimetype: string; size: number }> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    return files.map((file) => this.uploadFile(file));
  }
}
