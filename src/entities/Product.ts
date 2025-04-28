import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Brand } from "./Brand";
import { Review } from "./Review";
import { Wishlist } from "./Wishlist";
import { CartItem } from "./CartItem";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  type: string;

  @ManyToOne(() => Brand, (brand) => brand.products)
  @JoinColumn({ name: "brand_id" })
  brand: Brand;

  @Column()
  brand_id: number;

  @Column("decimal", { precision: 10, scale: 2 })
  original_price: number;

  @Column("decimal", { precision: 10, scale: 2 })
  sale_price: number;

  @Column("decimal", { precision: 3, scale: 1, nullable: true })
  rating: number;

  @Column({ default: 0 })
  review_count: number;

  @Column()
  short_description: string;

  @Column("text")
  detail_description: string;

  @Column("text")
  additional_information: string;

  @Column("jsonb")
  colors: string[];

  @Column("jsonb")
  imageUrls: string[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.product)
  wishlist: Wishlist[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cart_items: CartItem[];
}
