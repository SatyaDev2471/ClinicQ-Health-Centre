const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/database");

const doctorsRoutes = require("./routes/doctors");
const roomsRoutes = require("./routes/rooms");
const bookingsRoutes = require("./routes/bookings");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/doctors", doctorsRoutes);
app.use("/api/rooms", roomsRoutes);
app.use("/api/bookings", bookingsRoutes);

// Test route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to ClinicQ Health Centre API",
        status: "Server is running"
    });
});

// Server port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
