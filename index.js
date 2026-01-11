require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
// const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { sendContactEmail } = require('./controllers/mailcontroller.js');
const errorMiddleware = require("./middlewares/error.js");

// Load environment variables from .env file
// dotenv.config({ path: ".env" });
const PORT = process.env.PORT || 8000;

/* MONGODB CONNECTION START */
const MONGO_URL = process.env.MONGO_URL;


// Security headers
app.use(helmet());

// CORS
const cors = require("cors");
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173").split(",");
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "auth-token", "Origin", "X-Requested-With", "Accept"],
  })
);

// Check if MONGO_URL is defined
if (!MONGO_URL) {
  console.error("MONGO_URL is not defined in the environment variables.");
  process.exit(1); // Terminate the application
}

// MongoDB connection
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
  console.log("Error Connecting to Database", err);
});
/* MONGODB CONNECTION END */

app.use(express.json());
app.use(cookieParser());
// app.use(bodyParser.urlencoded({ extended: true }));

// Trust proxy (needed for accurate rate limiting behind proxies)
app.set("trust proxy", 1);

// Rate limiting for sensitive endpoints
const { errorHandler } = require("./utils/errorHandler.js");
const makeLimiter = (max) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: errorHandler(429, "Too Many Requests", "Too many requests, please try again later"),
  });

// Route Imports
const customer = require("./routes/customerRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const order = require("./routes/orderRoutes.js");
const admin = require("./routes/adminRoutes.js");
const wishlistRoutes = require("./routes/wishlistRoutes.js");
const subscriptionRoutes = require("./routes/subscriptionRoutes.js");
const { authorizeRoles } = require("./middlewares/auth.js");

// Apply rate limits on auth-related routes
app.use("/customer/login", makeLimiter(20));
app.use("/customer/register", makeLimiter(10));
app.use("/customer/resetpassword", makeLimiter(5));
app.use("/customer/resend-verification", makeLimiter(5));
app.use("/customer", customer);
app.use("/api", productRoutes);
app.use("/order", order);
app.use(bodyParser.json());
app.use("/api/subscribe", makeLimiter(30), subscriptionRoutes);

// app.use("/admin", authorizeRoles, admin);
app.use("/api/admin", admin); 


app.use("/api/wishlist", wishlistRoutes);
// app.use("admin", authorizeRoles, admin);

// Middleware for Errors
app.use(errorMiddleware);

// app.get("/", (req, res) => {
//   res.send(`Welcome to BOOK HEAVEN- by Salusha`);
// });

// Define the POST route
app.post("/api/contact", makeLimiter(30), sendContactEmail);

// New Route for Cart
const cartRoutes = require("./routes/cartRoutes.js");
app.use("/api/cart", cartRoutes);

// New Route for Address
const addressRoutes = require("./routes/addressRoutes.js");
app.use("/api/address", addressRoutes);

// Serve static files from the Vite build
app.use(express.static(path.join(__dirname, "client", "dist")));

// Fallback route: send index.html for all non-API GET routes
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});


// Start the server *after* all route declarations
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
//............


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
