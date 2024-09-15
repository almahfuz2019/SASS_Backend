const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");
const authRouter = require("./routes/authRouters");
const propertyRouter = require("./routes/propertyRoutes");
const visitorsRouters = require("./routes/visitorsRouters");
const parcelRouters = require("./routes/parcelRouters");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
connectDB();
app.use(cors({ origin: process.env.MAIN_URL, credentials: true }));
app.use(express.json());
// app.use(cors());
// API Routes
app.use("/api", userRoutes);
app.use("/api", contactRoutes);
app.use("/api", authRouter);
app.use("/api", propertyRouter);
app.use("/api", visitorsRouters);
app.use("/api", parcelRouters);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
