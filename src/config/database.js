// const { Sequelize } = require('sequelize');
// require('dotenv').config();

// // Initialize Sequelize
// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: 'postgres',
//     port: process.env.DB_PORT || 5432, // Use default Postgres port if not set
//     logging: false, // Disable logging; set true for debugging SQL queries
//   }
// );

// // Test Database Connection
// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Database connected successfully...');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// })();

// module.exports = sequelize;


const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use IPv6 address directly in the host or from environment variable
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || '2406:da18:243:7404:a669:57d1:80b4:c428', // IPv6 address
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432, // Use default Postgres port if not set
    logging: false, // Disable logging; set true for debugging SQL queries
    // dialectOptions: {
    //   useUTC: true, // Ensure timezone compatibility if needed
    // },
    dialectOptions: {
      useUTC: true, // Ensure timezone compatibility if needed
      ssl: {
        require: true, // Enable SSL connection
        rejectUnauthorized: false, // Set to false if using self-signed certificates
      },
    },
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

