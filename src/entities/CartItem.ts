import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./Cart";
import { Product } from "./Product";

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.items)
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartItems)
  product: Product;

  @Column()
  selectedColor: string;

  @Column({ default: 1 })
  quantity: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  priceAtTime: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  addedAt: Date;
}
