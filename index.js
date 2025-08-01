const express = require("express");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { sendContactEmail } = require('./controllers/mailcontroller.js');
const errorMiddleware = require("./middlewares/error.js");

// Load environment variables from .env file
dotenv.config({ path: ".env" });
const PORT = process.env.PORT || 8000;
console.log(process.env.MONGO_URL);

/* MONGODB CONNECTION START */
const MONGO_URL = process.env.MONGO_URL;


// CORS
const cors = require("cors");
app.use(
  cors({
    origin: ["http://localhost:5173"],  // Allow particular origins
    credentials: true,  
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  // Allow all methods
    allowedHeaders: ["Content-Type", "auth-token", "Origin", "X-Requested-With", "Accept"],  // Allow all required headers
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

// Route Imports
const customer = require("./routes/customerRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const order = require("./routes/orderRoutes.js");
const admin = require("./routes/adminRoutes.js");
const wishlistRoutes = require("./routes/wishlistRoutes.js");
const { authorizeRoles } = require("./middlewares/auth.js");

app.use("/customer", customer);
app.use("/api", productRoutes);
app.use("/order", order);
app.use(bodyParser.json());

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
app.post("/api/contact", sendContactEmail);
// New Route for Cart
const cartRoutes = require("./routes/cartRoutes.js");
app.use("/api/cart", cartRoutes);

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
