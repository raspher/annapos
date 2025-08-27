import { DataSource } from 'typeorm';
import { User } from './entities/User.js';
import {Category, Product} from './entities/Product.js';
import {Order, OrderItem} from './entities/Order.js';
import config from '../shared/config.js';
import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  migrations: [path.join(__dirname, '../../migrations/*.js')],
});

export default annaposDataSource;
