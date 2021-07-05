module.exports = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  db: process.env.DB_DATABASE,
  dialect: process.env.DB_CONNECTION,
  port: process.env.DB_PORT,
  camelCase: true,
  dialectOptions: {
    ssl: {
      require: true, // This will help you. But you will see nwe error
      rejectUnauthorized: false, // This line will fix new error
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
