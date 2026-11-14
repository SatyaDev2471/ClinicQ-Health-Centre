
const db = require("../config/database");

db.serialize(() => {
    console.log("Starting database reset...");

    // Delete existing records in foreign-key order
    db.run("DELETE FROM bookings");
    db.run("DELETE FROM rooms");
    db.run("DELETE FROM doctors");

    // Reset auto-increment IDs
    db.run("DELETE FROM sqlite_sequence WHERE name IN ('doctors', 'rooms', 'bookings')");

    // Insert sample doctors
    const doctors = [
        ["Asha", "Cardiology"],
        ["Ravi", "Neurology"],
        ["Priya", "Dermatology"],
        ["Kiran", "Orthopedics"]
    ];

    const insertDoctor = db.prepare(
        "INSERT INTO doctors (name, specialization) VALUES (?, ?)"
    );

    doctors.forEach(doctor => {
        insertDoctor.run(doctor);
    });

    insertDoctor.finalize();

    // Insert sample rooms
    const rooms = [
        ["Room 1", 1],
        ["Room 2", 1],
        ["Room 3", 2],
        ["Room 4", 2],
        ["Room 5", 3]
    ];

    const insertRoom = db.prepare(
        "INSERT INTO rooms (name, floor) VALUES (?, ?)"
    );

    rooms.forEach(room => {
        insertRoom.run(room);
    });

    insertRoom.finalize();

    console.log("Sample doctors and rooms inserted successfully!");
});

// Close database after operations finish
db.close();
