import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

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

  @Column()
  category: string;

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
