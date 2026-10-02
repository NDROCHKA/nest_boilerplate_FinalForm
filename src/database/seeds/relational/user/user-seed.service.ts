import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../../../../user/infrastructure/user.entity';
import { RoleEnum } from '../../../../utils/enums/roles.enum';
import { isEmail, isStrongPassword } from 'class-validator';

@Injectable()
export class UserSeedService {
  private readonly logger = new Logger(UserSeedService.name);

  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  async run(): Promise<boolean> {
    const email = process.env.SEED_SUPER_ADMIN_EMAIL?.trim().toLowerCase();
    const plainPassword = process.env.SEED_SUPER_ADMIN_PASSWORD;

    if (!email || !plainPassword) {
      throw new Error(
        'SEED_SUPER_ADMIN_EMAIL and SEED_SUPER_ADMIN_PASSWORD are required',
      );
    }

    if (!isEmail(email)) {
      throw new Error('SEED_SUPER_ADMIN_EMAIL must be a valid email address');
    }

    if (
      plainPassword.length > 72 ||
      !isStrongPassword(plainPassword, {
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      throw new Error(
        'SEED_SUPER_ADMIN_PASSWORD must be 12-72 characters and include upper, lower, number, and symbol characters',
      );
    }

    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(plainPassword, salt);
    const existing = await this.repository.findOne({
      where: { email },
      withDeleted: true,
    });

    if (existing) {
      if (existing.deletedAt || existing.role !== RoleEnum.superAdmin) {
        throw new Error(
          'The bootstrap email belongs to a deleted or non-admin account; resolve it manually before seeding',
        );
      }
      this.logger.log('Super admin already exists; no changes made');
      return false;
    }

    try {
      await this.repository.save(
        this.repository.create({
          email,
          password,
          firstName: process.env.SEED_SUPER_ADMIN_FIRST_NAME || 'Super',
          lastName: process.env.SEED_SUPER_ADMIN_LAST_NAME || 'Admin',
          phoneNumber: process.env.SEED_SUPER_ADMIN_PHONE || null,
          profilePicture: null,
          emailVerified: true,
          role: RoleEnum.superAdmin,
        }),
      );
      this.logger.log('Super admin created successfully');
      return true;
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === '23505'
      ) {
        this.logger.log('Super admin was created concurrently');
        return false;
      }
      throw error;
    }
  }
}
