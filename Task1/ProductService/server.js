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
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api', productRoutes);
app.use(cors());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
