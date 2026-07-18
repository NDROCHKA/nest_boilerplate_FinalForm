import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OtpEntity } from './otp.entity';
import { OtpTypeEnum } from '../../utils/enums/otp-type.enum';

@Injectable()
export class OtpRepository {
  constructor(
    @InjectRepository(OtpEntity)
    private readonly repository: Repository<OtpEntity>,
  ) {}

  async create(data: {
    userId: number;
    hash: string;
    type: OtpTypeEnum;
    expiresAt: Date;
  }): Promise<OtpEntity> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findLatestByUserAndType(
    userId: number,
    type: OtpTypeEnum,
  ): Promise<OtpEntity | null> {
    return this.repository.findOne({
      where: { userId, type },
      order: { createdAt: 'DESC' },
    });
  }

  async incrementAttempts(otpId: number): Promise<void> {
    await this.repository.increment({ id: otpId }, 'attempts', 1);
  }

  async deleteAllByUserAndType(
    userId: number,
    type: OtpTypeEnum,
  ): Promise<void> {
    await this.repository.delete({ userId, type });
  }
}
