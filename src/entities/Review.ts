import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./Product";

@Entity("reviews")
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column("decimal")
  rating: number;

  @Column("text")
  comment: string;

  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "productId" })
  product: Product;

  @Column()
  productId: number;
}
