
const express = require("express");
const router = express.Router();

const db = require("../config/database");

// Helper: Validate room details
function validateRoom(name, floor) {
    if (typeof name !== "string" || !name.trim()) {
        return "Room name is required";
    }

    if (
        floor === undefined ||
        floor === null ||
        floor === "" ||
        !Number.isInteger(Number(floor)) ||
        Number(floor) < 0
    ) {
        return "Floor must be a valid non-negative integer";
    }

    return null;
}

// 1. GET all rooms and SEARCH by floor
router.get("/", (req, res) => {
    const { floor } = req.query;

    let sql = "SELECT * FROM rooms";
    let params = [];

    if (floor !== undefined) {
        if (
            floor === "" ||
            !Number.isInteger(Number(floor)) ||
            Number(floor) < 0
        ) {
            return res.status(400).json({
                message: "Invalid floor value"
            });
        }

        sql += " WHERE floor = ?";
        params.push(Number(floor));
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.status(200).json(rows);
    });
});

// 2. GET room by ID
router.get("/:id", (req, res) => {
    const { id } = req.params;

    db.get(
        "SELECT * FROM rooms WHERE id = ?",
        [id],
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (!row) {
                return res.status(404).json({
                    message: "Room not found"
                });
            }

            res.status(200).json(row);
        }
    );
});

// 3. ADD a new room
router.post("/", (req, res) => {
    const { name, floor } = req.body;

    const error = validateRoom(name, floor);

    if (error) {
        return res.status(400).json({
            message: error
        });
    }

    db.run(
        "INSERT INTO rooms (name, floor) VALUES (?, ?)",
        [name.trim(), Number(floor)],
        function (err) {
            if (err) {
                if (err.message.includes("UNIQUE constraint failed")) {
                    return res.status(409).json({
                        message: "Room name already exists"
                    });
                }

                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Room added successfully",
                room: {
                    id: this.lastID,
                    name: name.trim(),
                    floor: Number(floor)
                }
            });
        }
    );
});

// 4. UPDATE room
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { name, floor } = req.body;

    const error = validateRoom(name, floor);

    if (error) {
        return res.status(400).json({
            message: error
        });
    }

    db.run(
        `UPDATE rooms
         SET name = ?, floor = ?
         WHERE id = ?`,
        [name.trim(), Number(floor), id],
        function (err) {
            if (err) {
                if (err.message.includes("UNIQUE constraint failed")) {
                    return res.status(409).json({
                        message: "Room name already exists"
                    });
                }

                return res.status(500).json({
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Room not found"
                });
            }

            res.status(200).json({
                message: "Room updated successfully"
            });
        }
    );
});

// 5. DELETE room
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    db.run(
        "DELETE FROM rooms WHERE id = ?",
        [id],
        function (err) {
            if (err) {
                if (err.message.includes("FOREIGN KEY constraint failed")) {
                    return res.status(409).json({
                        message: "Cannot delete room with existing bookings"
                    });
                }

                return res.status(500).json({
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Room not found"
                });
            }

            res.status(200).json({
                message: "Room deleted successfully"
            });
        }
    );
});

module.exports = router;
