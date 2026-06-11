const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const errorHandler = require("./middleware/errorHandler");

// Routes disabled - using localStorage instead
// const authRoutes = require("./routes/auth");
// const chatRoutes = require("./routes/chat");

dotenv.config();

// MongoDB connection removed - using localStorage instead

const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later."
});
app.use("/api/", limiter);

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("?? Parth AI Backend Running - Using localStorage");
});

// Routes disabled - using localStorage instead
// app.use("/api/auth", authRoutes);
// app.use("/api/chat", chatRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`?? Parth AI Server running on port ${PORT}`);
});
