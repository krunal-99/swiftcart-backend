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
  id: number;

  @Column({ type: "date" })
  date: string;

  @Column({
    type: "varchar",
    enum: ["processing", "shipped", "delivered"],
    default: "processing",
  })
  status: string;

  @Column({ type: "varchar" })
  shipping_address: string;

  @Column({ type: "date" })
  estimated_delivery: string;

  @Column({ type: "varchar", length: 50 })
  payment_method: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  payment_email: string;

  @Column({ type: "varchar", length: 50, default: "Pending" })
  payment_status: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  sessionId: string;

  @ManyToOne(() => Users, (users) => users.order)
  users: Users;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[];
}
