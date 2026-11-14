
const express = require("express");
const router = express.Router();

const db = require("../config/database");

// 1. GET all doctors
router.get("/", (req, res) => {
    db.all("SELECT * FROM doctors", [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.status(200).json(rows);
    });
});

// 2. GET doctor by ID
router.get("/:id", (req, res) => {
    const { id } = req.params;

    db.get(
        "SELECT * FROM doctors WHERE id = ?",
        [id],
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (!row) {
                return res.status(404).json({
                    message: "Doctor not found"
                });
            }

            res.status(200).json(row);
        }
    );
});

// 3. ADD a new doctor
router.post("/", (req, res) => {
    const { name, specialization } = req.body;

    if (
        typeof name !== "string" ||
        name.trim() === "" ||
        typeof specialization !== "string" ||
        specialization.trim() === ""
    ) {
        return res.status(400).json({
            error: "Name and specialization must be non-empty strings"
        });
    }

    db.run(
        "INSERT INTO doctors (name, specialization) VALUES (?, ?)",
        [name, specialization],
        function (err) {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Doctor added successfully",
                doctor: {
                    id: this.lastID,
                    name,
                    specialization
                }
            });
        }
    );
});

// 4. UPDATE doctor
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { name, specialization } = req.body;

    if (
        typeof name !== "string" ||
        name.trim() === "" ||
        typeof specialization !== "string" ||
        specialization.trim() === ""
    ) {
        return res.status(400).json({
            error: "Name and specialization must be non-empty strings"
        });
    }

    db.run(
        `UPDATE doctors
         SET name = ?, specialization = ?
         WHERE id = ?`,
        [name, specialization, id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Doctor not found"
                });
            }

            res.status(200).json({
                message: "Doctor updated successfully"
            });
        }
    );
});

// 5. DELETE doctor
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    db.run(
        "DELETE FROM doctors WHERE id = ?",
        [id],
        function (err) {
            if (err) {
                if (err.message.includes("FOREIGN KEY constraint failed")) {
                    return res.status(409).json({
                        message: "Cannot delete doctor with existing bookings"
                    });
                }

                return res.status(500).json({
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Doctor not found"
                });
            }

            res.status(200).json({
                message: "Doctor deleted successfully"
            });
        }
    );
});

module.exports = router;
