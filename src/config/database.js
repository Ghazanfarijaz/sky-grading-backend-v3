const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialize Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432, // Use default Postgres port if not set
    logging: false, // Disable logging; set true for debugging SQL queries
  }
);

// Test Database Connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully...');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
