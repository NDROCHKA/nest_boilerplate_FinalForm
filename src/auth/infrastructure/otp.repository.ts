import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThan, QueryRunner, Repository } from 'typeorm';

import { OtpEntity } from './otp.entity';
import { OtpTypeEnum } from '../../utils/enums/otp-type.enum';

@Injectable()
export class OtpRepository {
  constructor(
    @InjectRepository(OtpEntity)
    private readonly repository: Repository<OtpEntity>,
  ) {}

  private getRepository(queryRunner?: QueryRunner): Repository<OtpEntity> {
    return queryRunner
      ? queryRunner.manager.getRepository(OtpEntity)
      : this.repository;
  }

  async create(
    data: {
      userId: number;
      hash: string;
      type: OtpTypeEnum;
      expiresAt: Date;
      verifiedAt?: Date | null;
    },
    queryRunner?: QueryRunner,
  ): Promise<OtpEntity> {
    const repository = this.getRepository(queryRunner);
    const entity = repository.create(data);
    return repository.save(entity);
  }

  async findLatestByUserAndType(
    userId: number,
    type: OtpTypeEnum,
    queryRunner?: QueryRunner,
  ): Promise<OtpEntity | null> {
    return this.getRepository(queryRunner).findOne({
      where: { userId, type },
      order: { createdAt: 'DESC' },
    });
  }

  async incrementAttempts(
    otpId: number,
    queryRunner?: QueryRunner,
  ): Promise<void> {
    await this.getRepository(queryRunner).increment(
      { id: otpId },
      'attempts',
      1,
    );
  }

  async deleteAllByUserAndType(
    userId: number,
    type: OtpTypeEnum,
    queryRunner?: QueryRunner,
  ): Promise<void> {
    await this.getRepository(queryRunner).delete({ userId, type });
  }

  async authorizePasswordReset(
    otpId: number,
    resetTokenHash: string,
    expiresAt: Date,
  ): Promise<boolean> {
    const result = await this.repository.update(
      { id: otpId, verifiedAt: IsNull() },
      {
        hash: resetTokenHash,
        attempts: 0,
        verifiedAt: new Date(),
        expiresAt,
      },
    );

    return result.affected === 1;
  }

  async consumeAuthorizedPasswordReset(
    userId: number,
    resetTokenHash: string,
    queryRunner?: QueryRunner,
  ): Promise<boolean> {
    const result = await this.getRepository(queryRunner).delete({
      userId,
      type: OtpTypeEnum.PASSWORD_RESET,
      hash: resetTokenHash,
      verifiedAt: MoreThan(new Date(0)),
      expiresAt: MoreThan(new Date()),
    });

    return result.affected === 1;
  }
}
