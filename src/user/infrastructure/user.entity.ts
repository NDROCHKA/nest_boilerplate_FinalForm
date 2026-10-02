import {
  AfterLoad,
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { RoleEnum } from '../../utils/enums/roles.enum';

@Entity({ name: 'user' })
@Check('CHK_user_role', '"role" IN (1, 2)')
@Index('UQ_user_email', ['email'], { unique: true })
export class UserEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_user' })
  id: number;

  @Column({ type: 'varchar', length: 320, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  phoneNumber: string | null;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password?: string;

  @Exclude({ toPlainOnly: true })
  previousPassword?: string;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @Index('IDX_user_first_name')
  @Column({ type: 'varchar', length: 120, nullable: true })
  firstName: string | null;

  @Index('IDX_user_last_name')
  @Column({ type: 'varchar', length: 120, nullable: true })
  lastName: string | null;

  @Column({ type: 'varchar', nullable: true })
  profilePicture?: string | null;

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @Column({ type: 'integer', nullable: false })
  role: RoleEnum;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @Index('IDX_user_active', { where: '"deletedAt" IS NULL' })
  @DeleteDateColumn({ type: 'timestamp with time zone' })
  deletedAt: Date | null;
}
