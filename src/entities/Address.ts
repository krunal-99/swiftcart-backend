import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./User";

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  first_name: string;

  @Column({ type: "varchar" })
  last_name: string;

  @Column({ type: "varchar" })
  street_address: string;

  @Column({ type: "varchar" })
  city: string;

  @Column({ type: "varchar" })
  state: string;

  @Column({ type: "varchar" })
  pincode: string;

  @Column({ type: "varchar" })
  country: string;

  @Column({ type: "boolean", default: false })
  is_default: boolean;

  @ManyToOne(() => Users, (user) => user.addresses)
  user: Users;
}
