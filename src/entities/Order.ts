import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./User";
import { OrderItem } from "./OrderItem";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "date" })
  date: string;

  @Column({
    type: "varchar",
    enum: ["processing", "shipped", "delivered"],
    default: "processing",
  })
  status: string;

  @Column({ type: "varchar" })
  shippingAddress: string;

  @Column({ type: "date" })
  estimatedDelivery: string;

  @Column({ type: "varchar", length: 50 })
  paymentMethod: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  paymentEmail: string;

  @Column({ type: "varchar", length: 50, default: "Pending" })
  paymentStatus: string;

  @ManyToOne(() => Users, (users) => users.order)
  users: Users;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[];
}
