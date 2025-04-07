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
  @JoinColumn({ name: "brandId" })
  brand: Brand;

  @Column()
  brandId: number;

  @Column("decimal", { precision: 10, scale: 2 })
  originalPrice: number;

  @Column("decimal", { precision: 10, scale: 2 })
  salePrice: number;

  @Column("decimal", { precision: 3, scale: 1, nullable: true })
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column()
  shortDescription: string;

  @Column("text")
  detailDescription: string;

  @Column("text")
  additionalInformation: string;

  @Column("jsonb")
  colors: string[];

  @Column("jsonb")
  imageUrls: string[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.product)
  wishlist: Wishlist[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];
}
