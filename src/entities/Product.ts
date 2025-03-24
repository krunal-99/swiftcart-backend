import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

interface Reviews {
  username: string;
  rating: number;
  comment: string;
}

@Entity()
@Unique(["title"])
export class Products {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, unique: true })
  title: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  type: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  category: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  brand: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  originalPrice: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  salePrice: number;

  @Column({
    type: "decimal",
    precision: 3,
    scale: 2,
    default: 0,
    nullable: false,
  })
  rating: number;

  @Column({ type: "int", default: 0, nullable: false })
  reviewCount: number;

  @Column({ type: "text", nullable: false })
  shortDescription: string;

  @Column({ type: "text", nullable: false })
  detailDescription: string;

  @Column({ type: "text", nullable: true })
  additionalInformation: string;

  @Column({ type: "jsonb", nullable: false })
  colors: string[];

  @Column({ type: "jsonb", nullable: false })
  reviews: Reviews[];

  @Column({ type: "jsonb", nullable: false })
  imageUrls: string[];
}
