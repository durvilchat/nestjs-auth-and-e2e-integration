export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  logging: boolean;
}

export const dbConfig = () => ({
  database: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    database: process.env.MYSQL_DATABASE || 'db',
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'my-secret-pw',
  } as DatabaseConfig,
});
