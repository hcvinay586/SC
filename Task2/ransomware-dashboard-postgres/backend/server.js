const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger'); // Logger middleware
const errorHandler = require('./middleware/errorHandler'); // Error handling middleware
const ransomwareRoutes = require('./routes/ransomware'); // Routes
const sequelize = require('./config/database'); // Import Sequelize configuration

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger); // Use logger middleware

// Connect to PostgreSQL
sequelize.authenticate()
    .then(() => {
        console.log('PostgreSQL Connected...');
        // Sync models to the database (create tables if they don't exist)
        return sequelize.sync();
    })
    .then(() => console.log('Models synced with the database'))
    .catch(err => console.error('PostgreSQL connection error:', err));

// Routes
app.use('/api/ransomware', ransomwareRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
