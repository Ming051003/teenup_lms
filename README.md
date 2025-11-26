
---

````markdown
# TeenUp Learning Management System

TeenUp is a **Learning Center Management System** designed to manage parents, students, classes, tuition packages, and class registrations.  
Built with **Spring Boot**, **ReactJS**, **Docker**, and **MySQL/H2**.

---

## 1. How to Build & Run with Docker

### Requirements
- Docker & Docker Compose
- Git

### Steps
```bash
# Clone repository
git clone https://github.com/CanhDuc710/lms
cd lms

# Build & Run the whole system
docker-compose up --build
````

### Folder Structure

```
/backend              → Spring Boot API
/frontend             → ReactJS frontend
docker-compose.yml    → Build/Run configuration for backend & frontend
```

### After running

* **Backend API:** [http://localhost:8080](http://localhost:8080)
* **Frontend UI:** [http://localhost:5173](http://localhost:5173)
* **Swagger Docs:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

## 2. Database Schema Overview

The system contains **5 main tables**:

### 1. `Parents`

* **Primary Key:** `id`
* Fields: `name`, `phone` *(unique)*, `email` *(unique)*
* Soft delete: `deleted_at`
* Relationships: One-to-Many with `Students`

### 2. `Students`

* **Primary Key:** `id`
* Fields: `name`, `dob`, `gender` *(MALE/FEMALE/OTHER)*, `currentGrade`
* Foreign key: `parent_id → Parents`
* Soft delete
* Relationships:

  * Many-to-One with `Parents`
  * One-to-Many with `ClassRegistrations` and `Subscriptions`

### 3. `Classes`

* **Primary Key:** `id`
* Fields: `name`, `subject`, `dayOfWeek`, `startTime`, `endTime`, `teacherName`, `maxStudents`
* Soft delete, with helper method `isFull`
* Relationships: One-to-Many with `ClassRegistrations`

### 4. `Subscriptions`

* **Primary Key:** `id`
* Fields: `packageName`, `startDate`, `endDate`, `totalSessions`, `usedSessions`, `status` *(ACTIVE, EXPIRED, SUSPENDED, COMPLETED)*
* Foreign key: `student_id → Students`
* Soft delete, session tracking, auto-complete when finished
* Relationships: Many-to-One with `Students`

### 5. `ClassRegistrations`

* **Primary Key:** `id`
* Foreign keys: `class_id → Classes`, `student_id → Students`
* Constraint: Unique `(class_id, student_id)`
* Hard delete (no soft delete)
* Relationships: Many-to-One with both `Classes` and `Students`

---

## 3. Database Relationship Diagram 

Parent (1) ←→ (N) Student (1) ←→ (N) Subscription
                   ↓
               (1) ←→ (N) ClassRegistration (N) ←→ (1) SchoolClass

## 4. Main API Endpoints & Examples

### Parents API

```http
# Get all parents
GET /api/parents

# Create a new parent
POST /api/parents
Content-Type: application/json
{
  "name": "John Doe",
  "phone": "0901234567",
  "email": "john@example.com"
}
```

### Students API

```http
# Get all students
GET /api/students

# Create a new student
POST /api/students
Content-Type: application/json
{
  "name": "Jane Doe",
  "dob": "2010-05-15",
  "gender": "FEMALE",
  "currentGrade": 8,
  "parentId": 1
}
```

### Classes API

```http
# Get all classes
GET /api/classes

# Create a new class
POST /api/classes
Content-Type: application/json
{
  "name": "Advanced Math Grade 8",
  "subject": "Mathematics",
  "dayOfWeek": "MONDAY",
  "startTime": "14:00",
  "endTime": "16:00",
  "teacherName": "Mr. Smith",
  "maxStudents": 20
}
```

### Subscriptions API

```http
# Create a subscription for a student
POST /api/subscriptions
Content-Type: application/json
{
  "packageName": "Math 20 Sessions",
  "startDate": "2025-09-01",
  "endDate": "2025-12-31",
  "totalSessions": 20,
  "usedSessions": 0,
  "status": "ACTIVE",
  "studentId": 1
}
```

### ClassRegistrations API

```http
# Register a student to a class
POST /api/class-registrations
Content-Type: application/json
{
  "classId": 1,
  "studentId": 1,
  "status": "ACTIVE"
}
```

---

## 5. Notes on Design

* **Soft Delete:** All main entities except `ClassRegistrations` have `deleted_at`
* **Audit Trail:** All entities include `created_at` and `updated_at` timestamps
* **Business Logic:** Helper methods for status checks (`isExpired`, `isFull`, `hasRemainingSession`)
* **Validation:** Implemented with Bean Validation
* **Serialization:** `@JsonIgnoreProperties` used to avoid circular references

---
H2 Console Access
The backend is pre-configured with H2 Console enabled for debugging:

URL: http://localhost:8080/h2-console

JDBC URL: jdbc:h2:mem:testdb

Username: sa

Password: password

💡 The application.properties already has spring.h2.console.enabled=true.

Auto Data Seeding
The backend includes a src/main/resources/data.sql file, which:

Automatically inserts 2 parents, 3 students, 2–3 classes, and related subscriptions.

Runs every time the application starts (H2 resets on each run).

Useful for quick testing without manual database setup.

Also you can use Swagger for API documentation: http://localhost:8080/swagger-ui/index.html

---

### 📂 **Additional Files**

* **[API Documentation](./API_Documentation.md)** – Full list of API endpoints with request/response examples and descriptions.
* **[Postman Collection](./TeenUp_API_Collection.postman_collection.json)** – Pre-configured Postman collection for testing all API endpoints.

---


