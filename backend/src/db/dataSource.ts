import { DataSource } from 'typeorm';
import { User } from './entities/User.js';
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
  entities: ['entities/*.ts'],
  migrations: ['../../migrations/*.ts'],
});

export default annaposDataSource;
