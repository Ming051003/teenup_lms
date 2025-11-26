
---

````markdown
# TeenUp Learning Management System

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
               (1) ←→ (N) ClassRegistration (N) ←→ (1) Class

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
POST /api/classes/8/register
Content-Type: application/json
{
    "id": 62,
    "classId": 1,
    "studentId": 8,
    "status": 1,
    "registeredAt": "2025-11-26T19:33:51.9936679+01:00"
}
```



