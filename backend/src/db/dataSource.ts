import { DataSource } from 'typeorm';
import { User } from './entities/User.ts';
import { Category } from './entities/Category.ts';
import { Product } from './entities/Product.ts';
import config from '../shared/config.ts';

const annaposDataSource = new DataSource({
  type: 'postgres',
  host: config.POSTGRES_HOST,
  port: Number(config.POSTGRES_PORT),
  username: config.POSTGRES_USER,
  password: config.POSTGRES_PASSWORD,
  database: `${config.POSTGRES_DB}`,
  synchronize: false,
  logging: true,
  entities: [User, Category, Product],
  migrations: ['../../migrations/*.ts'],
});

try {
    await annaposDataSource.initialize()
    console.log("Data Source has been initialized!")
} catch (error) {
    console.error("Error during Data Source initialization", error)
}

export default annaposDataSource;
