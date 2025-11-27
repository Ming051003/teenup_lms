# TeenUp Learning Management System

TeenUp Learning Management System là hệ thống quản lý học sinh và lớp học, cho phép phụ huynh theo dõi và quản lý thông tin học sinh của mình, đăng ký lớp học, và quản lý các gói đăng ký học.

Hệ thống đã được deploy chỉ cần truy cập link sau để sử dụng: https://teenup-c2911.web.app

## 1. **Giới Thiệu**

- **Backend API:** [https://lmsteenup.runasp.net/](https://lmsteenup.runasp.net/)
- **Frontend UI:** [https://teenup-c2911.web.app/](https://teenup-c2911.web.app/)
- **Swagger UI:** [https://teenup-c2911.web.app/](https://lmsteenup.runasp.net/swagger/index.html)
---

## 2. **Cấu Trúc Cơ Sở Dữ Liệu**

Hệ thống sử dụng 5 bảng chính trong cơ sở dữ liệu:

### 1. `Parents`
- **Khóa chính:** `id`
- Các trường: `name`, `phone` *(duy nhất)*, `email` *(duy nhất)*
- Xóa mềm: `deleted_at`
- Quan hệ: Một phụ huynh có thể có nhiều học sinh (One-to-Many với `Students`).

### 2. `Students`
- **Khóa chính:** `id`
- Các trường: `name`, `dob`, `gender` *(MALE/FEMALE/OTHER)*, `currentGrade`
- Khóa ngoại: `parent_id → Parents`
- Xóa mềm
- Quan hệ:
  - Một học sinh thuộc một phụ huynh (Many-to-One với `Parents`)
  - Một học sinh có thể đăng ký nhiều lớp học và có nhiều gói đăng ký (One-to-Many với `ClassRegistrations` và `Subscriptions`)

### 3. `Classes`
- **Khóa chính:** `id`
- Các trường: `name`, `subject`, `dayOfWeek`, `startTime`, `endTime`, `teacherName`, `maxStudents`
- Xóa mềm với phương thức hỗ trợ `isFull`
- Quan hệ: Một lớp học có thể có nhiều học sinh đăng ký (One-to-Many với `ClassRegistrations`)

### 4. `Subscriptions`
- **Khóa chính:** `id`
- Các trường: `packageName`, `startDate`, `endDate`, `totalSessions`, `usedSessions`, `status` *(ACTIVE, EXPIRED, SUSPENDED, COMPLETED)*
- Khóa ngoại: `student_id → Students`
- Xóa mềm, theo dõi số phiên học, tự động hoàn tất khi kết thúc
- Quan hệ: Một gói đăng ký thuộc về một học sinh (Many-to-One với `Students`)

### 5. `ClassRegistrations`
- **Khóa chính:** `id`
- Khóa ngoại: `class_id → Classes`, `student_id → Students`
- Ràng buộc: Duy nhất `(class_id, student_id)`
- Xóa cứng (không xóa mềm)
- Quan hệ: Một học sinh có thể đăng ký nhiều lớp học và một lớp học có thể có nhiều học sinh (Many-to-One với cả `Classes` và `Students`)

---

## 3. **Sơ Đồ Quan Hệ Cơ Sở Dữ Liệu**

Parent (1) ←→ (N) Student (1) ←→ (N) Subscription
↓
(1) ←→ (N) ClassRegistration (N) ←→ (1) Class


---

## 4. **Các API Chính và Ví Dụ Sử Dụng**

### API `Parents`

```http
# Lấy tất cả phụ huynh
GET /api/parents

# Tạo mới một phụ huynh
POST /api/parents
Content-Type: application/json
{
  "name": "John Doe",
  "phone": "0901234567",
  "email": "john@example.com"
}


# Lấy tất cả học sinh
GET /api/students

# Tạo mới một học sinh
POST /api/students
Content-Type: application/json
{
  "name": "Jane Doe",
  "dob": "2010-05-15",
  "gender": "FEMALE",
  "currentGrade": 8,
  "parentId": 1
}
# Lấy tất cả lớp học
GET /api/classes

# Tạo mới một lớp học
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

# Tạo gói đăng ký cho học sinh
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
# Đăng ký học sinh vào lớp học
POST /api/classes/8/register
Content-Type: application/json
{
    "id": 62,
    "classId": 1,
    "studentId": 8,
    "status": 1,
    "registeredAt": "2025-11-26T19:33:51.9936679+01:00"
}

5. Cài Đặt và Triển Khai
Bước 1: Triển Khai Backend
API Backend được triển khai tại: https://lmsteenup.runasp.net/
Đảm bảo rằng bạn đã triển khai ASP.NET API và cấu hình đúng các endpoint như trong phần API bên trên.
Kiểm tra các chức năng API của bạn bằng các công cụ như Postman hoặc cURL để đảm bảo hoạt động đúng.

Bước 2: Triển Khai Frontend
Frontend UI của hệ thống đã được triển khai tại: https://teenup-c2911.web.app/
Đảm bảo rằng bạn có môi trường ReactJS đã được cài đặt và cấu hình để kết nối với API của backend.

Bước 3: Kiểm Tra và Vận Hành
Đảm bảo API và UI hoạt động tốt khi kết nối với nhau.
Kiểm tra các chức năng tạo, đọc, cập nhật và xóa dữ liệu cho từng bảng.
