import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Wishlist } from "./Wishlist";
import { Cart } from "./Cart";
import { Address } from "./Address";
import { Order } from "./Order";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  imageUrl: string;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 150, unique: true })
  email: string;

  @Column({ type: "varchar", length: 150 })
  password: string;

  @OneToMany(() => Wishlist, (wishlist) => wishlist.id)
  wishlist: Wishlist[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;
}
