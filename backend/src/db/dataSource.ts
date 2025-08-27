import { DataSource } from 'typeorm';
import { User } from './entities/User.js';
import { Category } from './entities/Category.js';
import { Product } from './entities/Product.js';
import { Order } from './entities/Order.js';
import { OrderItem } from './entities/OrderItem.js';
import config from '../shared/config.js';

const annaposDataSource = new DataSource({
  type: 'postgres',
  host: config.POSTGRES_HOST,
  port: Number(config.POSTGRES_PORT),
  username: config.POSTGRES_USER,
  password: config.POSTGRES_PASSWORD,
  database: `${config.POSTGRES_DB}`,
  synchronize: false,
  logging: true,
  entities: [User, Category, Product, Order, OrderItem],
  migrations: ['../../migrations/*.ts'],
});

export default annaposDataSource;
