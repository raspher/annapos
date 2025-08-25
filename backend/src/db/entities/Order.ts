import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderItem } from "./OrderItem.ts";

export type OrderStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 16, default: 'PENDING' })
  status!: OrderStatus;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  total!: string; // numeric as string

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: ['insert'], eager: true })
  items!: OrderItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;
}
