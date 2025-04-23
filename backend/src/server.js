const express = require("express");
const connectDB = require("../config/db");
const userRoutes = require("../routes/userRoutes");
const authRoutes = require("../routes/authRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use("/users", userRoutes);
//app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000; // changed port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
