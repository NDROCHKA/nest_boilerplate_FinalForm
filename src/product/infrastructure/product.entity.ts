import {
  Column,
  Check,
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
@Check('CHK_product_price_positive', '"price" > 0')
@Check('CHK_product_stock_nonnegative', '"stock" >= 0')
@Check(
  'CHK_product_discount_range',
  '"discountPercent" IS NULL OR "discountPercent" BETWEEN 0 AND 100',
)
@Index('IDX_product_catalog', ['categoryId', 'isActive', 'deletedAt'])
export class ProductEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_product' })
  id: number;

  @Index('IDX_product_name')
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
  @JoinColumn({
    name: 'categoryId',
    foreignKeyConstraintName: 'FK_product_category',
  })
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
