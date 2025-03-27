import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./Product";
import { Category } from "./Category";

@Entity("brands")
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToOne(() => Category, (category) => category.brands)
  @JoinColumn({ name: "categoryId" })
  category: Category;

  @Column()
  categoryId: number;

  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];
}
