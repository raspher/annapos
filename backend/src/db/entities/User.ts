import {Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 75 })
    name!: string;

    @Column({type: 'varchar', length: 254})
    email!: string;

    @Column({type: 'varchar', length: 128})
    password!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}