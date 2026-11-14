# 🏥 ClinicQ Health Centre – Consultation Room Booking API

A RESTful backend application for managing doctors, consultation rooms and room bookings at ClinicQ Health Centre.

Built using **Node.js, Express.js and SQLite** as part of the Backend Development Fundamentals group assignment.

---

## 🌐 Live Deployment

**Live API Base URL:**

https://clinicq-health-centre.onrender.com

**API Health Check:**

https://clinicq-health-centre.onrender.com/

**GitHub Repository:**

https://github.com/SatyaDev2471/ClinicQ-Health-Centre

The application is deployed using Render Web Services.

> **Note:** This project uses Render's free hosting plan. Its filesystem is ephemeral, so SQLite database changes may be lost when the service restarts, spins down or is redeployed. Persistent database storage is not available with this deployment configuration.

---

## 📌 Project Overview

ClinicQ Health Centre is a backend application designed to manage consultation rooms and doctor bookings efficiently.

The application provides RESTful APIs for:

- Managing doctors.
- Managing consultation rooms.
- Managing room bookings.
- Returning booked rooms.
- Searching rooms by floor.
- Retrieving booking details using SQL JOIN operations.
- Validating user inputs.
- Preventing multiple active bookings for the same room.

The main objective is to ensure that a consultation room cannot be assigned to two doctors simultaneously.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime environment |
| Express.js | Backend framework |
| SQLite | Relational database |
| sqlite3 | SQLite database driver |
| CORS | Cross-Origin Resource Sharing |
| dotenv | Environment variable management |
| Nodemon | Automatic server restarting during development |
| Postman | API development and testing |
| Git & GitHub | Version control and source code hosting |
| Render | Cloud deployment |

---

## 📂 Project Structure

```text
ClinicQ-Health-Centre/
│
├── .postman/
│   └── resources.yaml
│
├── config/
│   └── database.js
│
├── database/
│   ├── clinicq.db
│   └── seed.js
│
├── postman/
│   ├── collections/
│   ├── documents/
│   ├── environments/
│   ├── flows/
│   ├── globals/
│   ├── mocks/
│   └── specs/
│
├── routes/
│   ├── bookings.js
│   ├── doctors.js
│   └── rooms.js
│
├── screenshots/
│
├── app.js
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── ClinicQ_Health_Centre_API.postman_collection.json
```

---

## 🗄️ Database Design

The application uses SQLite with three related tables.

### 1. Doctors Table

Stores information about doctors.

| Column | Data Type | Description |
|---|---|---|
| id | INTEGER | Primary key |
| name | TEXT | Doctor's name |
| specialization | TEXT | Medical specialization |

### 2. Rooms Table

Stores consultation room information.

| Column | Data Type | Description |
|---|---|---|
| id | INTEGER | Primary key |
| name | TEXT | Unique room name |
| floor | INTEGER | Floor number |

### 3. Bookings Table

Stores room booking information.

| Column | Data Type | Description |
|---|---|---|
| id | INTEGER | Primary key |
| doctor_id | INTEGER | Foreign key referencing doctors |
| room_id | INTEGER | Foreign key referencing rooms |
| booked_at | DATETIME | Booking creation timestamp |
| returned_at | DATETIME | Room return timestamp; NULL indicates an active booking |

### Database Relationships

```text
       DOCTORS
          |
          | 1
          |
          | Many
       BOOKINGS
          |
          | Many
          |
          | 1
        ROOMS
```

The `doctor_id` and `room_id` columns establish relationships between the three tables through foreign keys.

---

## ⚙️ Installation and Setup

### Prerequisites

Install the following before running the project:

- Node.js
- npm
- Git
- Postman (optional, for API testing)

### Step 1: Clone the Repository

```bash
git clone https://github.com/SatyaDev2471/ClinicQ-Health-Centre.git
```

### Step 2: Navigate to the Project Directory

```bash
cd ClinicQ-Health-Centre
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start the Development Server

```bash
npm run dev
```

Alternatively, start the application using:

```bash
npm start
```

The local server runs at:

```text
http://localhost:5000
```

The application uses the `PORT` environment variable when provided, or port 5000 as the default.

### Step 5: Database Initialization

The application initializes the SQLite database and creates the required tables when the database connection is established.

To reset the database and insert sample data, run:

```bash
node database/seed.js
```

**Warning:** The seed script resets existing data before inserting the sample records. Do not run it if you need to preserve existing bookings.

---

## 🔗 API Documentation

### Base URLs

**Local:**

```text
http://localhost:5000
```

**Deployed:**

```text
https://clinicq-health-centre.onrender.com
```

### 1. Doctors API

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/api/doctors` | Retrieve all doctors |
| GET | `/api/doctors/:id` | Retrieve a doctor by ID |
| POST | `/api/doctors` | Add a new doctor |
| PUT | `/api/doctors/:id` | Update doctor details |
| DELETE | `/api/doctors/:id` | Delete a doctor |

**Example – Add Doctor**

```http
POST /api/doctors
```

Request Body:

```json
{
  "name": "Asha",
  "specialization": "Cardiology"
}
```

Expected status: `201 Created`

### 2. Rooms API

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/api/rooms` | Retrieve all rooms |
| GET | `/api/rooms/:id` | Retrieve a room by ID |
| GET | `/api/rooms?floor=2` | Search rooms by floor |
| POST | `/api/rooms` | Add a new room |
| PUT | `/api/rooms/:id` | Update room details |
| DELETE | `/api/rooms/:id` | Delete a room |

**Example – Add Room**

```http
POST /api/rooms
```

Request Body:

```json
{
  "name": "Room 6",
  "floor": 3
}
```

Expected status: `201 Created`

**Example – Search by Floor**

```http
GET /api/rooms?floor=2
```

This retrieves rooms located on floor 2.

### 3. Bookings API

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/api/bookings` | Retrieve all bookings |
| GET | `/api/bookings/:id` | Retrieve a booking by ID |
| POST | `/api/bookings` | Create a room booking |
| PATCH | `/api/bookings/:id/return` | Return a booked room |

**Example – Create Booking**

```http
POST /api/bookings
```

Request Body:

```json
{
  "doctor_id": 1,
  "room_id": 3
}
```

Expected status: `201 Created`

**Example – Return Booking**

```http
PATCH /api/bookings/1/return
```

This marks the booking as returned and makes the room available for another booking.

### 4. Booking Details – SQL JOIN API

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/api/bookings/details/all` | Retrieve booking details with doctor and room information |

This endpoint uses SQL INNER JOIN to combine records from the doctors, rooms and bookings tables.

The response includes:

- Booking ID
- Doctor name
- Doctor specialization
- Room name
- Floor number
- Booking timestamp
- Return timestamp

Example:

```http
GET /api/bookings/details/all
```

Expected status: `200 OK`

---

## 🚫 Double-Booking Prevention

One of the most important requirements of this project is preventing a consultation room from being booked by multiple doctors at the same time.

The application implements this requirement using:

1. An active-booking check before creating a booking.
2. A SQLite partial unique index on `room_id` where `returned_at IS NULL`.
3. HTTP 409 Conflict when a room already has an active booking.

### Required Test Scenario

| Step | Operation | Expected Result |
|---|---|---|
| 1 | Asha books Room 3 | 201 Created |
| 2 | Ravi attempts to book Room 3 | 409 Conflict |
| 3 | Asha returns Room 3 | 200 OK |
| 4 | Ravi books Room 3 again | 201 Created |

**Example conflict response:**

```json
{
  "error": "Room 3 is already booked"
}
```

This ensures that a room can have only one active booking at a time.

---

## ✅ HTTP Status Codes

The application uses appropriate HTTP status codes to communicate API results.

| Status Code | Meaning | Usage |
|---|---|---|
| 200 | OK | Successful retrieval, update or return |
| 201 | Created | Resource successfully created |
| 400 | Bad Request | Invalid input or validation failure |
| 404 | Not Found | Requested resource does not exist |
| 409 | Conflict | Duplicate or conflicting operation |
| 500 | Internal Server Error | Unexpected server-side error |

---

## 🧪 API Testing with Postman

The project includes an exported Postman collection:

```text
ClinicQ_Health_Centre_API.postman_collection.json
```

### Import Instructions

1. Open Postman.
2. Select Import.
3. Choose the exported collection JSON file.
4. Open the imported collection.
5. Configure the `baseUrl` collection variable.

**For local testing:**

```text
http://localhost:5000
```

**For deployed testing:**

```text
https://clinicq-health-centre.onrender.com
```

The collection uses dynamic variables for request URLs, path parameters, query parameters and editable request bodies.

All API endpoints were tested locally and the deployed API endpoints were tested using Postman.

---

## ☁️ Deployment

The application is deployed using Render Web Services.

**Deployment URL:**

https://clinicq-health-centre.onrender.com

### Deployment Configuration

| Setting | Value |
|---|---|
| Platform | Render |
| Service Type | Web Service |
| Runtime | Node.js |
| Branch | main |
| Build Command | `npm install --build-from-source` |
| Start Command | `npm start` |
| Instance Type | Free |

### SQLite Storage Limitation

This project uses SQLite on Render's free hosting plan.

Render Free does not provide a persistent disk for this service. Therefore, database changes can be lost when the service restarts, spins down or is redeployed.

The local SQLite database is retained in the project repository as the sample database.

---

## 🚀 Future Enhancements

The following features can be added in future versions:

- Authentication and authorization.
- Role-based access for administrators and doctors.
- Doctor availability management.
- Appointment scheduling.
- Booking history and reporting.
- Improved database persistence for production deployment.
- Frontend interface for easier interaction with the APIs.

---

## 👥 Project Information

| Detail | Information |
|---|---|
| Project Name | ClinicQ Health Centre – Consultation Rooms |
| Assignment | Backend Development Fundamentals |
| Group | Group 8 |
| Section | CSEQE2B |
| Academic Year | 2026–2027 |

---

## 👨‍💻 Author

**GitHub:** [SatyaDev2471](https://github.com/SatyaDev2471)

**Project Repository:** [ClinicQ-Health-Centre](https://github.com/SatyaDev2471/ClinicQ-Health-Centre)

**Live Application:** [ClinicQ Health Centre API](https://clinicq-health-centre.onrender.com/)

---

*Developed as part of the Backend Development Fundamentals Group Assignment – 2026–2027.*