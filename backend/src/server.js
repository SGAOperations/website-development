const express = require('express');
const connectDB = require('../config/db');
const userRoutes = require('../routes/userRoutes');
const cors = require('cors');
require('dotenv').config();

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
app.use('/users', userRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
