const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
connectDB();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
// API Routes
app.use("/api", userRoutes);
app.use("/api", contactRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
