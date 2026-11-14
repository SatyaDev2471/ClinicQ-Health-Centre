
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Database file location
const dbPath = path.join(
    __dirname,
    "../database/clinicq.db"
);

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Connected to ClinicQ SQLite database");
    }
});

// Enable foreign key support
db.run("PRAGMA foreign_keys = ON");

// Create tables
db.serialize(() => {

    // Doctors table
    db.run(`
        CREATE TABLE IF NOT EXISTS doctors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            specialization TEXT NOT NULL
        )
    `);

    // Rooms table
    db.run(`
        CREATE TABLE IF NOT EXISTS rooms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            floor INTEGER NOT NULL
        )
    `);

    // Bookings table
    db.run(`
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            doctor_id INTEGER NOT NULL,
            room_id INTEGER NOT NULL,
            booked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            returned_at DATETIME DEFAULT NULL,

            FOREIGN KEY (doctor_id) REFERENCES doctors(id),
            FOREIGN KEY (room_id) REFERENCES rooms(id)
        )
    `);

    // Prevent two active bookings for the same room
    db.run(`
        CREATE UNIQUE INDEX IF NOT EXISTS
        unique_active_room_booking
        ON bookings(room_id)
        WHERE returned_at IS NULL
    `, (err) => {
        if (err) {
            console.error("Index creation failed:", err.message);
        } else {
            console.log("Database tables created successfully");
        }
    });
});

// Export database connection
module.exports = db;
