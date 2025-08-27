import {
    Column, CreateDateColumn, DeleteDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn,
    Relation, UpdateDateColumn
} from "typeorm";
import type { Product } from "./Product.js";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 128, unique: true })
  @Index({ unique: true })
  name!: string;

  @OneToMany("Product", (product: Product) => product.category)
  products!: Relation<Product>[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;
}
