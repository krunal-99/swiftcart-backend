import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./User";

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  firstName: string;

  @Column({ type: "varchar" })
  lastName: string;

  @Column({ type: "varchar" })
  streetAddress: string;

  @Column({ type: "varchar" })
  city: string;

  @Column({ type: "varchar" })
  state: string;

  @Column({ type: "varchar" })
  pincode: string;

  @Column({ type: "varchar" })
  country: string;

  @Column({ type: "boolean", default: false })
  isDefault: boolean;

  @ManyToOne(() => Users, (user) => user.addresses)
  user: Users;
}
