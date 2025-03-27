import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Brand } from "./Brand";

@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Brand, (brand) => brand.category)
  brands: Brand[];

  @Column()
  label: string;

  @Column()
  imageUrl: string;
}
