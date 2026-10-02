import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity({ name: 'product_image' })
@Index('IDX_product_image_product_sort', ['productId', 'sortOrder'])
export class ProductImageEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_product_image' })
  id: number;

  @Column({ type: 'varchar' })
  url: string;

  @Column({ type: 'integer', default: 0 })
  sortOrder: number;

  @ManyToOne(() => ProductEntity, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'productId',
    foreignKeyConstraintName: 'FK_product_image_product',
  })
  product: ProductEntity;

  @Column({ type: 'integer' })
  productId: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
