# 🕰️ Time Capsule API

The Time Capsule API is a secure, RESTful backend service that allows users to store **time-locked messages ("capsules")** that can only be opened after a specified unlock time. Each capsule is protected with a unique unlock code and expires 30 days after becoming accessible.

**Live Base URL**: [http://13.234.57.74:8000](http://13.234.57.74:8000)

---

## 🚀 Features

- ✅ User registration and login with JWT authentication
- 📝 Create, retrieve, update, and delete capsules
- ⏳ Capsules unlock at a scheduled future time
- 🔒 Secure access via unlock code
- ♻️ Capsules expire 30 days after unlock time
- 🔁 Background task to mark expired capsules
- 📃 Pagination for capsule listing
- 💾 Hosted on AWS EC2 with PostgreSQL on AWS RDS

---

## 📦 API Endpoints

> All protected routes require a JWT token in the header:
```
Authorization: Bearer <JWT_TOKEN>
```

### 🔐 Auth

#### POST `/auth/register`
```json
{
  "email": "testNew@gmail.com",
  "password": "test123"
}
```

#### POST `/auth/login`
```json
{
  "email": "testNew@gmail.com",
  "password": "test123"
}
```

---

### 📦 Capsules

#### Create Capsule  
`POST /capsules`
```json
{
  "message": "first message",
  "unlock_at": "2025-05-14T12:00:00Z"
}
```

Returns:
```json
{
  "id": 1,
  "unlock_code": "abc123ef"
}
```

#### Retrieve Capsule  
`GET /capsules/{id}?code=UNLOCK_CODE`

Responses:
- `200 OK` – Returns capsule
- `401 Unauthorized` – Missing or invalid unlock code
- `403 Forbidden` – Unlock time not reached
- `410 Gone` – Capsule expired

#### List Capsules  
`GET /capsules?page=1&limit=10`

Returns:
- Capsule metadata (without message if locked)

#### Update Capsule  
`PUT /capsules/{id}?code=UNLOCK_CODE`
```json
{
  "message": "Updated message!",
  "unlock_at": "2026-01-01T00:00:00Z"
}
```

#### Delete Capsule  
`DELETE /capsules/{id}?code=UNLOCK_CODE`

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (hosted on AWS RDS)
- **ORM**: Sequelize
- **Authentication**: JWT, Argon2
- **Hosting**: AWS EC2
- **Testing**: Mocha, Chai, Supertest

---

## 🧪 Running the App Locally

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/time-capsule-api.git
cd time-capsule-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file using `.env.example`:
```
ACCESS_TOKEN_SECRET_KEY=your-secret-key
DB_HOST=postgres://username:password@host:port/dbname
DB_USER=
DB_PORT=5432
DB_PASSWORD=
DB_NAME=
NODE_ENV=test
```

### 4. Start the Server
```bash
node server.js
```

---

## ✅ Running Tests

```bash
npm test
```

---

## 📌 Assumptions & Notes

- Capsules are accessible only after their unlock time and expire 30 days later.
- Unlock code is mandatory for view/update/delete.
- Background expiration runs every minute for demo purposes (adjust in production).
- Only the authenticated user can access their own capsules.

---

## 📎 Deployment

The API is deployed on:
- **AWS EC2** (Node.js app)
- **AWS RDS** (PostgreSQL database)

Example live route:  
🔗 `POST` [http://13.234.57.74:8000/auth/login](http://13.234.57.74:8000/auth/login)

---

------

## 🧪 Using the API with Postman

Here's how you can test the Time Capsule API using [Postman](https://www.postman.com/):

### 1. Register a New User

- **Method:** `POST`
- **URL:** `http://13.234.57.74:8000/auth/register`
- **Body (JSON):**
```json
{
  "email": "testNew@gmail.com",
  "password": "test123"
}
```

---

### 2. Login to Get JWT Token

- **Method:** `POST`
- **URL:** `http://13.234.57.74:8000/auth/login`
- **Body (JSON):**
```json
{
  "email": "testNew@gmail.com",
  "password": "test123"
}
```

- ✅ Copy the `accessToken` from the response.

---

### 3. Set Authorization Header in Postman

- Go to the **Headers** tab.
- Add:
  ```
  Key: Authorization
  Value: Bearer <your_access_token>
  ```

---

### 4. Create a Capsule

- **Method:** `POST`
- **URL:** `http://13.234.57.74:8000/capsules`
- **Body (JSON):**
```json
{
  "message": "Hello future!",
  "unlock_at": "2025-05-14T12:00:00Z"
}
```

---

### 5. Retrieve a Capsule

- **Method:** `GET`
- **URL:** `http://13.234.57.74:8000/capsules/{id}?code=UNLOCK_CODE`

Replace `{id}` and `UNLOCK_CODE` with values from the creation response.

---

### 6. List Capsules

- **Method:** `GET`
- **URL:** `http://13.234.57.74:8000/capsules?page=1&limit=10`

---

### 7. Update Capsule

- **Method:** `PUT`
- **URL:** `http://13.234.57.74:8000/capsules/{id}?code=UNLOCK_CODE`
- **Body (JSON):**
```json
{
  "message": "Updated message",
  "unlock_at": "2026-01-01T00:00:00Z"
}
```

---

### 8. Delete Capsule

- **Method:** `DELETE`
- **URL:** `http://13.234.57.74:8000/capsules/{id}?code=UNLOCK_CODE`

---
