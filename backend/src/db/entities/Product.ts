import {
    Column, CreateDateColumn, DeleteDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn,
    Relation, UpdateDateColumn
} from "typeorm";
import type { Category } from "./Category.js";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', unique: true })
  @Index({ unique: true })
  externalId!: number; // id from FakeStoreAPI

  @Column({ type: 'varchar', length: 256 })
  title!: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price!: string; // using string to avoid JS floating issues with numeric

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  imageUrl!: string | null;

  @Column({ type: 'real', nullable: true })
  ratingRate!: number | null;

  @Column({ type: 'int', nullable: true })
  ratingCount!: number | null;

  @ManyToOne("Category", { nullable: false, eager: true })
  category!: Relation<Category>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;
}
