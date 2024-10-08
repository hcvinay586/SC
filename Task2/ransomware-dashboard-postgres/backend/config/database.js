const { Sequelize } = require('sequelize');

// Connect to PostgreSQL database using Sequelize
const sequelize = new Sequelize('ransomwaredb', 'root', 'Admin123', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,  // Disable logging for cleaner output
});

module.exports = sequelize;
