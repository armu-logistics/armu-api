module.exports = {
  development: {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_DATABASE,
    dialect: "mariadb",
    camelCase: true,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  uat: {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_DATABASE,
    dialect: "mariadb",
    camelCase: true,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  production: {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_DATABASE,
    dialect: "mariadb",
    camelCase: true,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};
