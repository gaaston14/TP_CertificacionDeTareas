const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  app: {
    port: process.env.PORT || 4000,
  },
  jwt: {
    signature: process.env.JWT_SIGNATURE || 'default_secret',
  },
  mysql: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    ssl: {
      require: true,
      rejectUnauthorized: true,
      servername: process.env.MYSQL_HOST
    }
  }
};