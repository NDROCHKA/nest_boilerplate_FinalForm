import {
  Column,
  Check,
  CreateDateColumn,
  Entity,
  JoinColumn,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/infrastructure/user.entity';
import { OtpTypeEnum } from '../../utils/enums/otp-type.enum';

@Entity({ name: 'otp' })
@Check('CHK_otp_attempts_nonnegative', '"attempts" >= 0')
@Check('CHK_otp_type', `"type" IN ('EMAIL_VERIFICATION', 'PASSWORD_RESET')`)
@Index('IDX_otp_user_type_created', ['userId', 'type', 'createdAt'])
export class OtpEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_otp' })
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', foreignKeyConstraintName: 'FK_otp_user' })
  user: UserEntity;

  @Column({ type: 'varchar' })
  hash: string;

  @Column({ type: 'varchar' })
  type: OtpTypeEnum;

  @Column({ type: 'integer', default: 0 })
  attempts: number;

  @Column({ type: 'timestamp with time zone' })
  expiresAt: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  verifiedAt: Date | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
