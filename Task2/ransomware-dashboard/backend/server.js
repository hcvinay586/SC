const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('./middleware/logger');         // Logger middleware
const errorHandler = require('./middleware/errorHandler'); // Error handling middleware
const ransomwareRoutes = require('./routes/ransomware');  // Routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger); // Use logger middleware

// Connect to MongoDB
mongoose.connect('mongodb+srv://hcvinay:0vFte0Solzgxt3fs@cluster0.tbvux.mongodb.net/Ransomeware')
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/ransomware', ransomwareRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
