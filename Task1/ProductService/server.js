const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const { protect } = require('./middleware/authMiddleware');

dotenv.config();
connectDB();
const app = express();
// Parse incoming JSON requests
app.use(express.json());

// Define the CORS options
const corsOptions = {
  origin: 'http://localhost:3000', // Allow your frontend app
  credentials: true, // Allow credentials (e.g., cookies, authorization headers)
};

// Use the CORS middleware with options
app.use(cors(corsOptions));

app.use('/api/users', userRoutes);
app.use('/api', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
