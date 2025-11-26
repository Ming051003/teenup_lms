Backend API: http://localhost:8080

Frontend UI: http://localhost:5173

Swagger Docs: http://localhost:8080/swagger-ui.html





2\. Database Schema Overview

The system contains 5 main tables:



1\. Parents

Primary Key: id

Fields: name, phone (unique), email (unique)

Soft delete: deleted\_at

Relationships: One-to-Many with Students

2\. Students

Primary Key: id



Fields: name, dob, gender (MALE/FEMALE/OTHER), currentGrade



Foreign key: parent\_id → Parents



Soft delete



Relationships:



Many-to-One with Parents

One-to-Many with ClassRegistrations and Subscriptions

3\. Classes

Primary Key: id

Fields: name, subject, dayOfWeek, startTime, endTime, teacherName, maxStudents

Soft delete, with helper method isFull

Relationships: One-to-Many with ClassRegistrations

4\. Subscriptions

Primary Key: id

Fields: packageName, startDate, endDate, totalSessions, usedSessions, status (ACTIVE, EXPIRED, SUSPENDED, COMPLETED)

Foreign key: student\_id → Students

Soft delete, session tracking, auto-complete when finished

Relationships: Many-to-One with Students

5\. ClassRegistrations

Primary Key: id

Foreign keys: class\_id → Classes, student\_id → Students

Constraint: Unique (class\_id, student\_id)

Hard delete (no soft delete)

Relationships: Many-to-One with both Classes and Students



3\. Database Relationship Diagram

Parent (1) ←→ (N) Student (1) ←→ (N) Subscription ↓ (1) ←→ (N) ClassRegistration (N) ←→ (1) Class

