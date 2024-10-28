import { MySqlContainer } from '@testcontainers/mysql';
import { getDatasource } from './util';

const init = async () => {
  await Promise.all([initMysql()]);
};

const initMysql = async () => {
  const mysql = await new MySqlContainer('mysql:8')
    .withDatabase('test_db')
    .withUsername('test_user')
    .withUserPassword('test_password')
    .start();

  global.mysql = mysql;

  process.env.MYSQL_HOST = mysql.getHost();
  process.env.MYSQL_PORT = mysql.getPort().toString();
  process.env.MYSQL_USER = mysql.getUsername();
  process.env.MYSQL_PASSWORD = mysql.getUserPassword();
  process.env.MYSQL_DATABASE = mysql.getDatabase();
  await getDatasource();
};

export default init;
