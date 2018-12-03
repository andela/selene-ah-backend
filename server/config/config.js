require('babel-core/register');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DEV,
    host: process.env.DB_HOST,
    dialect: process.env.DIALECT
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_TEST,
    host: process.env.DB_HOST,
    dialect: process.env.DIALECT
  },
  production: {
    DB_URL: process.env.DATABASE_URL
  }
};
