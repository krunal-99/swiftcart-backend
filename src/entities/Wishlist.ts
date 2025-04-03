import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./User";
import { Product } from "./Product";

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => Users, (user) => user.wishlist)
  @JoinColumn({ name: "userId" })
  user: Users;

  @Column()
  productId: number;

  @ManyToOne(() => Product, (product) => product.wishlist)
  @JoinColumn({ name: "productId" })
  product: Product;
}
