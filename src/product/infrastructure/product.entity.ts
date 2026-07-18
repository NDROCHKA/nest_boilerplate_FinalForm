import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryEntity } from '../../category/infrastructure/category.entity';
import { ProductImageEntity } from './product-image.entity';

@Entity({ name: 'product' })
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'integer', nullable: true, default: null })
  discountPercent: number | null;

  // PostgreSQL array column — Super Admin defines available sizes per product
  @Column({ type: 'text', array: true, default: '{}' })
  sizes: string[];

  // PostgreSQL array column — available colors
  @Column({ type: 'text', array: true, default: '{}' })
  colors: string[];

  @Column({ type: 'integer', default: 0 })
  stock: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => CategoryEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @Column({ type: 'integer' })
  categoryId: number;

  @OneToMany(() => ProductImageEntity, (image) => image.product, {
    cascade: true,
    eager: false,
  })
  images: ProductImageEntity[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone' })
  deletedAt: Date | null;
}
