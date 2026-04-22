import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Category } from '../../categories/category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal')
  price: number;

  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  image_url: string;

  @Column({ default: false })
  instock: boolean;

  @Column({ type: 'decimal', default: 0 })
  rating: number;

  // optional: store properties as JSON
  @Column({ type: 'json', nullable: true })
  properties?: { key: string; value: string }[];

  @ManyToOne(() => User, (user) => user.products, { nullable: false })
  owner: User;
}
