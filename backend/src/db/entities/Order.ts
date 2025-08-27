import {
    Column, CreateDateColumn, DeleteDateColumn, Entity,
    ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import {Product} from "./Product.js";

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

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Order, (order) => order.items, { nullable: false, onDelete: 'CASCADE' })
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
