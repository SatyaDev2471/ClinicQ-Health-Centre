
const express = require("express");
const router = express.Router();

const db = require("../config/database");

// 1. GET all bookings
router.get("/", (req, res) => {
    const sql = `
        SELECT * FROM bookings
        ORDER BY id DESC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.status(200).json(rows);
    });
});

// 2. GET booking by ID
router.get("/:id", (req, res) => {
    const { id } = req.params;

    db.get(
        "SELECT * FROM bookings WHERE id = ?",
        [id],
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (!row) {
                return res.status(404).json({
                    message: "Booking not found"
                });
            }

            res.status(200).json(row);
        }
    );
});

// 3. CREATE a booking
router.post("/", (req, res) => {
    const { doctor_id, room_id } = req.body;

    // Validate input
    if (
        !Number.isInteger(doctor_id) ||
        !Number.isInteger(room_id) ||
        doctor_id <= 0 ||
        room_id <= 0
    ) {
        return res.status(400).json({
            message: "Valid doctor_id and room_id are required"
        });
    }

    // Check whether doctor exists
    db.get(
        "SELECT * FROM doctors WHERE id = ?",
        [doctor_id],
        (err, doctor) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (!doctor) {
                return res.status(404).json({
                    message: "Doctor not found"
                });
            }

            // Check whether room exists
            db.get(
                "SELECT * FROM rooms WHERE id = ?",
                [room_id],
                (err, room) => {
                    if (err) {
                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    if (!room) {
                        return res.status(404).json({
                            message: "Room not found"
                        });
                    }

                    // Check whether room is already booked
                    db.get(
                        `SELECT id FROM bookings
                         WHERE room_id = ?
                         AND returned_at IS NULL`,
                        [room_id],
                        (err, booking) => {
                            if (err) {
                                return res.status(500).json({
                                    error: err.message
                                });
                            }

                            if (booking) {
                                return res.status(409).json({
                                    message: `${room.name} is already booked`
                                });
                            }

                            // Create booking
                            db.run(
                                `INSERT INTO bookings
                                 (doctor_id, room_id)
                                 VALUES (?, ?)`,
                                [doctor_id, room_id],
                                function (err) {
                                    if (err) {
                                        // Database index also prevents
                                        // simultaneous double bookings.
                                        if (err.message.includes("UNIQUE constraint failed")) {
                                            return res.status(409).json({
                                                message: `${room.name} is already booked`
                                            });
                                        }

                                        return res.status(500).json({
                                            error: err.message
                                        });
                                    }

                                    res.status(201).json({
                                        message: "Booking created successfully",
                                        booking: {
                                            id: this.lastID,
                                            doctor_id,
                                            room_id,
                                            returned_at: null
                                        }
                                    });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});

// 4. RETURN a room
router.patch("/:id/return", (req, res) => {
    const { id } = req.params;

    db.run(
        `UPDATE bookings
         SET returned_at = CURRENT_TIMESTAMP
         WHERE id = ?
         AND returned_at IS NULL`,
        [id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return db.get(
                    "SELECT id FROM bookings WHERE id = ?",
                    [id],
                    (err, booking) => {
                        if (err) {
                            return res.status(500).json({
                                error: err.message
                            });
                        }

                        if (!booking) {
                            return res.status(404).json({
                                message: "Booking not found"
                            });
                        }

                        res.status(409).json({
                            message: "This booking has already been returned"
                        });
                    }
                );
            }

            res.status(200).json({
                message: "Room returned successfully"
            });
        }
    );
});


// 5. GET bookings with doctor and room names (JOIN)
router.get("/details/all", (req, res) => {

    const sql = `
        SELECT
            bookings.id AS booking_id,
            doctors.name AS doctor_name,
            doctors.specialization AS specialization,
            rooms.name AS room_name,
            rooms.floor AS floor,
            bookings.booked_at,
            bookings.returned_at

        FROM bookings

        INNER JOIN doctors
            ON bookings.doctor_id = doctors.id

        INNER JOIN rooms
            ON bookings.room_id = rooms.id

        ORDER BY bookings.id DESC
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.status(200).json({
            message: "Booking details retrieved successfully",
            total: rows.length,
            bookings: rows
        });
    });
});


module.exports = router;
