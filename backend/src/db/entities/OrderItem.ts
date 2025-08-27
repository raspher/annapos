import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import type { Order } from "./Order.js";
import { Product } from "./Product.js";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne("Order", (order: Order) => order.items, { nullable: false, onDelete: 'CASCADE' })
  order!: Order;

  @ManyToOne(() => Product, { nullable: true, eager: true })
  product!: Product | null; // reference for convenience

  @Column({ type: 'varchar', length: 256 })
  productName!: string; // snapshot name

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  productPrice!: string; // snapshot price as string

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  lineTotal!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;
}
