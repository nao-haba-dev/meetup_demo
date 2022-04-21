module.exports = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '3306',
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'meetup',

  // Entityの自動同期無効
  synchronize: false,

  // クエリおよびエラーのロギングを有効にする
  logging: true,
  entities: ['src/**/**/*.entity{.ts,.js}'],
  migrations: ['src/databases/migrations/*.ts'],
  seeds: ['src/databases/seeders/*.seed.{js,ts}'],
  factories: ['src/databases/factories/*.factory.{js,ts}'],
  cli: {
    migrationsDir: 'src/databases/migrations',
    entitiesDir: 'src/**/entities',
    seedersDir: 'src/databases/seeders',
    factoriesDir: 'src/databases/factories',
  },
};
