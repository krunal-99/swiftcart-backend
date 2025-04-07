import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Wishlist } from "./Wishlist";
import { Cart } from "./Cart";

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
}
