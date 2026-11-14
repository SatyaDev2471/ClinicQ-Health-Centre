# ClinicQ Health Centre – Consultation Room Booking API

A RESTful API for managing doctors, consultation rooms, and room bookings at ClinicQ Health Centre. Built using **Node.js, Express.js, and SQLite**.

## Project Overview

ClinicQ Health Centre provides an API to manage doctors, consultation rooms, and their bookings.

The system supports:
- Complete CRUD operations for doctors.
- Complete CRUD operations for consultation rooms.
- Room search by floor.
- Booking and returning consultation rooms.
- JOIN queries to retrieve booking details with doctor and room information.
- Input validation and appropriate HTTP status codes.
- Prevention of double booking of active consultation rooms.

## Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| SQLite | Database |
| sqlite3 | SQLite database driver |
| CORS | Cross-origin resource sharing |
| dotenv | Environment configuration |
| Nodemon | Development server |

## Project Structure

```text
ClinicQ-Health-Centre/
│
├── config/
│   └── database.js
│
├── database/
│   ├── clinicq.db
│   └── seed.js
│
├── routes/
│   ├── doctors.js
│   ├── rooms.js
│   └── bookings.js
│
├── app.js
├── package.json
├── package-lock.json
├── .gitignore
├── README.md
└── ClinicQ_Health_Centre_API.postman_collection.json
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ClinicQ-Health-Centre.git
```

### 2. Navigate to the project directory

```bash
cd ClinicQ-Health-Centre
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The server runs at:

```text
http://localhost:5000
```

If you need to reset the database and insert the sample doctors and rooms:

```bash
node database/seed.js
```

**Warning:** Running the seed script deletes existing bookings, doctors, and rooms before inserting the sample data.

## Database Design

The application uses three related SQLite tables.

### Doctors

| Column | Description |
|---|---|
| id | Primary key |
| name | Doctor name |
| specialization | Medical specialization |

### Rooms

| Column | Description |
|---|---|
| id | Primary key |
| name | Unique room name |
| floor | Floor number |

### Bookings

| Column | Description |
|---|---|
| id | Primary key |
| doctor_id | References doctors |
| room_id | References rooms |
| booked_at | Booking timestamp |
| returned_at | Return timestamp; NULL means active |

## API Documentation

Base URL:

```text
http://localhost:5000
```

### 1. Doctors API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/doctors` | Get all doctors |
| GET | `/api/doctors/:id` | Get doctor by ID |
| POST | `/api/doctors` | Add a doctor |
| PUT | `/api/doctors/:id` | Update a doctor |
| DELETE | `/api/doctors/:id` | Delete a doctor |

Example POST body:

```json
{
  "name": "Asha",
  "specialization": "Cardiology"
}
```

### 2. Rooms API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/rooms` | Get all rooms |
| GET | `/api/rooms/:id` | Get room by ID |
| GET | `/api/rooms?floor=2` | Search rooms by floor |
| POST | `/api/rooms` | Add a room |
| PUT | `/api/rooms/:id` | Update a room |
| DELETE | `/api/rooms/:id` | Delete a room |

Example POST body:

```json
{
  "name": "Room 6",
  "floor": 3
}
```

### 3. Bookings API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/bookings` | Get all bookings |
| GET | `/api/bookings/:id` | Get booking by ID |
| POST | `/api/bookings` | Create a booking |
| PATCH | `/api/bookings/:id/return` | Return a room |

Example POST body:

```json
{
  "doctor_id": 1,
  "room_id": 3
}
```

### 4. Booking Details – JOIN API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/bookings/details/all` | Get booking details with doctor and room names |

This endpoint uses SQL INNER JOIN to retrieve related information from the doctors, rooms, and bookings tables.

## No-Double-Booking Rule

A consultation room cannot be assigned to two doctors simultaneously while its previous booking is active.

The application uses a partial unique SQLite index to enforce this rule.

Example test flow:

| Operation | Expected status |
|---|---|
| Asha books Room 3 | 201 Created |
| Ravi tries to book Room 3 | 409 Conflict |
| Asha returns Room 3 | 200 OK |
| Ravi books Room 3 again | 201 Created |

## HTTP Status Codes

| Status | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

## Testing with Postman

1. Open Postman.
2. Import `ClinicQ_Health_Centre_API.postman_collection.json`.
3. Set the `baseUrl` collection variable to `http://localhost:5000`.
4. Configure the doctor, room, booking, and floor variables.
5. Execute the requests to test the APIs.

## Future Improvements

- Authentication and authorization.
- Role-based access for administrators and doctors.
- Appointment scheduling.
- Improved reporting and analytics.

## Author / Group

**Project:** ClinicQ Health Centre – Consultation Rooms  
**Section:** CSEQE2B  
**Group:** Group 8  
**Academic Year:** 2026–2027

---

*Developed as part of the Backend Development Fundamentals group assignment.*