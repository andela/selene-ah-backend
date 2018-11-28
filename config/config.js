import dotenv from 'dotenv';

dotenv.config();

export default {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DEV,
    "host": process.env.DB_HOST,
    "dialect": process.env.DIALECT,
  },
  "test": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_TEST,
    "host": process.env.DB_HOST,
    "dialect": process.env.DIALECT,
  },
  "production": {
    DB_URL = process.env.DB_URL,
  }
};
