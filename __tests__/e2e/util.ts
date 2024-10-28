import { DataSource } from 'typeorm';
import * as process from 'process';

let datasource: DataSource;

export const getDatasource = async () => {
  if (datasource) {
    return datasource;
  }
  datasource = new DataSource({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    database: process.env.MYSQL_DATABASE,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    synchronize: true,
    logging: true,
    entities: [`**/*.entity.ts`],
    relationLoadStrategy: 'join',
  });
  await datasource.initialize();
  return datasource;
};
