import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/infrastructure/user.entity';
import { OtpTypeEnum } from '../../utils/enums/otp-type.enum';

@Entity({ name: 'otp' })
export class OtpEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'varchar' })
  hash: string;

  @Column({ type: 'varchar' })
  type: OtpTypeEnum;

  @Column({ type: 'integer', default: 0 })
  attempts: number;

  @Column({ type: 'timestamp with time zone' })
  expiresAt: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
