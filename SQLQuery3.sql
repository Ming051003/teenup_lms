-- =====================================================
-- TeenUp Demo Application - Sample Data
-- =====================================================

-- =====================================================
-- INSERT PARENTS (Phụ huynh)
-- =====================================================
INSERT INTO parents (name, phone, email, CreatedAt, UpdatedAt) VALUES
(N'Nguyễn Văn An', '0901234567', 'nguyenvanan@gmail.com', GETDATE(), GETDATE()),
(N'Trần Thị Bình', '0902345678', 'tranthibinh@gmail.com', GETDATE(), GETDATE()),
(N'Lê Văn Cường', '0903456789', 'levancuong@gmail.com', GETDATE(), GETDATE()),
(N'Phạm Thị Dung', '0904567890', 'phamthidung@gmail.com', GETDATE(), GETDATE()),
(N'Hoàng Văn Em', '0905678901', 'hoangvanem@gmail.com', GETDATE(), GETDATE()),
(N'Vũ Thị Hoa', '0906789012', 'vuthihoa@gmail.com', GETDATE(), GETDATE()),
(N'Đặng Văn Khải', '0907890123', 'dangvankhai@gmail.com', GETDATE(), GETDATE()),
(N'Bùi Thị Lan', '0908901234', 'buithilan@gmail.com', GETDATE(), GETDATE()),
(N'Ngô Văn Minh', '0909012345', 'ngovanminh@gmail.com', GETDATE(), GETDATE()),
(N'Đỗ Thị Nga', '0910123456', 'dothinga@gmail.com', GETDATE(), GETDATE());

-- =====================================================
-- INSERT STUDENTS (Học sinh)
-- =====================================================
INSERT INTO students (name, DateOfBirth, gender, CurrentGrade, ParentId, CreatedAt, UpdatedAt) VALUES
-- Con của Nguyễn Văn An
(N'Nguyễn Minh Đức', '2010-05-15',1, 'Grade 8', 1, GETDATE(), GETDATE()),
(N'Nguyễn Thu Hà', '2012-08-20', 0, 'Grade 6', 1, GETDATE(), GETDATE()),

-- Con của Trần Thị Bình
(N'Trần Minh Khang', '2011-03-10',1, 'Grade 7', 2, GETDATE(), GETDATE()),
(N'Trần Thùy Linh', '2013-12-05', 0, 'Grade 5', 2, GETDATE(), GETDATE()),

-- Con của Lê Văn Cường
(N'Lê Hoàng Nam', '2009-07-22',1, 'Grade 9', 3, GETDATE(), GETDATE()),
(N'Lê Thị Oanh', '2011-11-18', 0, 'Grade 7', 3, GETDATE(), GETDATE()),

-- Con của Phạm Thị Dung
(N'Phạm Văn Phúc', '2010-09-30',1, 'Grade 8', 4, GETDATE(), GETDATE()),
(N'Phạm Thị Quỳnh', '2012-02-14', 0, 'Grade 6', 4, GETDATE(), GETDATE()),

-- Con của Hoàng Văn Em
(N'Hoàng Minh Tuấn', '2008-12-03',1, 'Grade 10', 5, GETDATE(), GETDATE()),
(N'Hoàng Thị Vân', '2011-06-25', 0, 'Grade 7', 5, GETDATE(), GETDATE()),

-- Con của Vũ Thị Hoa
(N'Vũ Đức Anh', '2010-04-17',1, 'Grade 8', 6, GETDATE(), GETDATE()),
(N'Vũ Thị Bảo', '2013-09-08', 0, 'Grade 5', 6, GETDATE(), GETDATE()),

-- Con của Đặng Văn Khải
(N'Đặng Thành Long', '2009-10-12',1, 'Grade 9', 7, GETDATE(), GETDATE()),
(N'Đặng Thị Mai', '2012-05-27', 0, 'Grade 6', 7, GETDATE(), GETDATE()),

-- Con của Bùi Thị Lan
(N'Bùi Văn Hùng', '2011-08-19',1, 'Grade 7', 8, GETDATE(), GETDATE()),
(N'Bùi Thị Nhung', '2013-03-16', 0, 'Grade 5', 8, GETDATE(), GETDATE()),

-- Con của Ngô Văn Minh
(N'Ngô Đình Tài', '2010-09-23',1, 'Grade 8', 9, GETDATE(), GETDATE()),
(N'Ngô Thị Yến', '2012-09-11', 0, 'Grade 6', 9, GETDATE(), GETDATE()),

-- Con của Đỗ Thị Nga
(N'Đỗ Minh Hiếu', '2009-11-07',1, 'Grade 9', 10, GETDATE(), GETDATE()),
(N'Đỗ Thị Xuân', '2011-04-02', 0, 'Grade 7', 10, GETDATE(), GETDATE());

-- =====================================================
-- INSERT CLASSES (Lớp học)
-- =====================================================
INSERT INTO Classes (name, subject, [DayOfWeek], StartTime, EndTime, TeacherName, MaxStudents, CreatedAt, UpdatedAt) VALUES
-- Thứ 2
(N'Toán Nâng Cao A1', 'Mathematics', 1, '08:00:00', '09:30:00', N'Thầy Nguyễn Văn Phú', 20, GETDATE(), GETDATE()),
(N'Tiếng Anh Giao Tiếp B1', 'English', 1, '10:00:00', '11:30:00', N'Cô Sarah Johnson', 15, GETDATE(), GETDATE()),
(N'Lý Cơ Bản C1', 'Physics', 1, '14:00:00', '15:30:00', N'Thầy Lê Minh Tuấn', 18, GETDATE(), GETDATE()),
(N'Hóa Nâng Cao D1', 'Chemistry', 1, '16:00:00', '17:30:00', N'Cô Trần Thị Mai', 16, GETDATE(), GETDATE()),

-- Thứ 3
(N'Toán THCS A2', 'Mathematics', 2, '08:00:00', '09:30:00', N'Thầy Phạm Đức Anh', 22, GETDATE(), GETDATE()),
(N'Văn Học Thiếu Nhi B2', 'Literature', 2, '10:00:00', '11:30:00', N'Cô Nguyễn Thị Hoa', 20, GETDATE(), GETDATE()),
(N'Tiếng Anh Căn Bản C2', 'English', 2, '14:00:00', '15:30:00', N'Cô Emma Wilson', 18, GETDATE(), GETDATE()),
(N'Tin Học Văn Phòng D2', 'Computer Science', 2, '16:00:00', '17:30:00', N'Thầy Vũ Minh Khang', 12, GETDATE(), GETDATE()),

-- Thứ 4
(N'Lý Nâng Cao A3', 'Physics', 3, '08:00:00', '09:30:00', N'Thầy Hoàng Văn Nam', 15, GETDATE(), GETDATE()),
(N'Toán Tư Duy B3', 'Mathematics', 3, '10:00:00', '11:30:00', N'Cô Đặng Thị Lan', 25, GETDATE(), GETDATE()),
(N'Tiếng Anh IELTS C3', 'English', 3, '14:00:00', '15:30:00', N'Thầy Michael Brown', 10, GETDATE(), GETDATE()),
(N'Hóa Thực Hành D3', 'Chemistry', 3, '16:00:00', '17:30:00', N'Cô Bùi Thị Nga', 14, GETDATE(), GETDATE()),

-- Thứ 5
(N'Văn THCS A4', 'Literature', 4, '08:00:00', '09:30:00', N'Cô Lý Thị Vân', 20, GETDATE(), GETDATE()),
(N'Toán Hình Học B4', 'Mathematics', 4, '10:00:00', '11:30:00', N'Thầy Ngô Đức Minh', 18, GETDATE(), GETDATE()),
(N'Sinh Học Căn Bản C4', 'Biology', 4, '14:00:00', '15:30:00', N'Cô Phạm Thị Quỳnh', 20, GETDATE(), GETDATE()),
(N'Tiếng Anh Thiếu Nhi D4', 'English', 4, '16:00:00', '17:30:00', N'Cô Lisa Anderson', 16, GETDATE(), GETDATE()),

-- Thứ 6
(N'Lý Thí Nghiệm A5', 'Physics', 5, '08:00:00', '09:30:00', N'Thầy Trần Văn Hùng', 12, GETDATE(), GETDATE()),
(N'Hóa Phân Tích B5', 'Chemistry', 5, '10:00:00', '11:30:00', N'Cô Võ Thị Xuân', 15, GETDATE(), GETDATE()),
(N'Toán Ứng Dụng C5', 'Mathematics', 5, '14:00:00', '15:30:00', N'Thầy Đỗ Minh Tài', 20, GETDATE(), GETDATE()),
(N'Tiếng Anh Học Thuật D5', 'English', 5, '16:00:00', '17:30:00', N'Thầy James Wilson', 12, GETDATE(), GETDATE()),

-- Thứ 7
(N'Văn Sáng Tác A6', 'Literature', 6, '08:00:00', '09:30:00', N'Cô Nguyễn Thị Thu', 15, GETDATE(), GETDATE()),
(N'Toán Olimpic B6', 'Mathematics', 6, '10:00:00', '11:30:00', N'Thầy Lê Đức Thọ', 10, GETDATE(), GETDATE()),
(N'Lập Trình Scratch C6', 'Computer Science', 6, '14:00:00', '15:30:00', N'Thầy Phạm Minh Đức', 12, GETDATE(), GETDATE()),
(N'Tiếng Anh Phiên Dịch D6', 'English', 6, '16:00:00', '17:30:00', N'Cô Anna Taylor', 8, GETDATE(), GETDATE()),

-- Chủ nhật
(N'Toán Tổng Hợp A7', 'Mathematics', 0, '08:00:00', '09:30:00', N'Thầy Vũ Văn Thành', 25, GETDATE(), GETDATE()),
(N'Khoa Học Tự Nhiên B7', 'Science', 0, '10:00:00', '11:30:00', N'Cô Hoàng Thị Linh', 20, GETDATE(), GETDATE()),
(N'Kỹ Năng Mềm C7', 'Soft Skills', 0, '14:00:00', '15:30:00', N'Thầy Đặng Văn Long', 30, GETDATE(), GETDATE()),
(N'Tiếng Anh Tổng Quát D7', 'English', 0, '16:00:00', '17:30:00', N'Cô Jennifer Davis', 18, GETDATE(), GETDATE());

-- =====================================================
-- INSERT SUBSCRIPTIONS (Gói học)
-- =====================================================
INSERT INTO subscriptions (StudentId, PackageName, StartDate, EndDate, TotalSessions, UsedSessions, Status, CreatedAt, UpdatedAt) VALUES
-- Học sinh Grade 8-9-10 (Premium packages)
(2, N'Gói Premium 3 Tháng', '2025-09-09', '2025-03-31', 36, 8, 1, GETDATE(), GETDATE()),
(5, N'Gói Premium 6 Tháng', '2025-09-09', '2025-06-30', 72, 15, 1, GETDATE(), GETDATE()),
(9, N'Gói Premium 1 Năm', '2025-09-09', '2025-12-31', 144, 25, 1, GETDATE(), GETDATE()),
(13, N'Gói Premium 3 Tháng', '2025-02-09', '2025-04-30', 36, 12, 1, GETDATE(), GETDATE()),
(17, N'Gói Premium 6 Tháng', '2025-09-15', '2025-07-15', 72, 20, 1, GETDATE(), GETDATE()),
(19, N'Gói Premium 3 Tháng', '2025-03-09', '2025-05-31', 36, 5, 1, GETDATE(), GETDATE()),

-- Học sinh Grade 6-7 (Standard packages)
(2, N'Gói Standard 2 Tháng', '2025-09-09', '2025-02-29', 24, 18, 1, GETDATE(), GETDATE()),
(3, N'Gói Standard 3 Tháng', '2025-09-15', '2025-04-15', 36, 22, 1, GETDATE(), GETDATE()),
(6, N'Gói Standard 4 Tháng', '2025-02-09', '2025-05-31', 48, 30, 1, GETDATE(), GETDATE()),
(10, N'Gói Standard 2 Tháng', '2025-03-09', '2025-04-30', 24, 8, 1, GETDATE(), GETDATE()),
(15, N'Gói Standard 3 Tháng', '2025-09-09', '2025-03-31', 36, 28, 1, GETDATE(), GETDATE()),
(18, N'Gói Standard 2 Tháng', '2025-02-15', '2025-04-15', 24, 12, 1, GETDATE(), GETDATE()),
(20, N'Gói Standard 4 Tháng', '2025-09-09', '2025-04-30', 48, 35, 1, GETDATE(), GETDATE()),

-- Học sinh Grade 5 (Basic packages)
(4, N'Gói Basic 1 Tháng', '2025-09-09', '2025-09-31', 12, 12, 2, GETDATE(), GETDATE()),
(8, N'Gói Basic 2 Tháng', '2025-02-09', '2025-03-31', 24, 16, 1, GETDATE(), GETDATE()),
(12, N'Gói Basic 1 Tháng', '2025-03-09', '2025-03-31', 12, 8, 1, GETDATE(), GETDATE()),
(16, N'Gói Basic 2 Tháng', '2025-09-15', '2025-03-15', 24, 20, 1, GETDATE(), GETDATE()),

-- Một số gói đã hết hạn/suspended
(7, N'Gói Trial 2 Tuần', '2023-12-09', '2023-12-15', 6, 5, 0, GETDATE(), GETDATE()),
(11, N'Gói Standard 1 Tháng', '2023-12-09', '2023-12-31', 12, 8, 0, GETDATE(), GETDATE()),

-- =====================================================
-- INSERT CLASS REGISTRATIONS (Đăng ký lớp học)
-- =====================================================
INSERT INTO ClassRegistrations (ClassId, StudentId, [Status], RegisteredAt) VALUES
-- Thứ 2
(28, 2, 1, GETDATE()), -- Nguyễn Minh Đức -> Toán Nâng Cao A1
(28, 5, 1, GETDATE()), -- Lê Hoàng Nam -> Toán Nâng Cao A1
(28, 7, 1, GETDATE()), -- Phạm Văn Phúc -> Toán Nâng Cao A1
(28, 9, 1, GETDATE()), -- Hoàng Minh Tuấn -> Toán Nâng Cao A1
(28, 11, 1, GETDATE()), -- Vũ Đức Anh -> Toán Nâng Cao A1

(2, 2, 1, GETDATE()), -- Nguyễn Thu Hà -> Tiếng Anh Giao Tiếp B1
(2, 4, 1, GETDATE()), -- Trần Thùy Linh -> Tiếng Anh Giao Tiếp B1
(2, 6, 1, GETDATE()), -- Lê Thị Oanh -> Tiếng Anh Giao Tiếp B1
(2, 8, 1, GETDATE()), -- Phạm Thị Quỳnh -> Tiếng Anh Giao Tiếp B1

(3, 13, 1, GETDATE()), -- Đặng Thành Long -> Lý Cơ Bản C1
(3, 17, 1, GETDATE()), -- Ngô Đình Tài -> Lý Cơ Bản C1
(3, 19, 1, GETDATE()), -- Đỗ Minh Hiếu -> Lý Cơ Bản C1

-- Thứ 3
(5, 3, 1, GETDATE()), -- Trần Minh Khang -> Toán THCS A2
(5, 15, 1, GETDATE()), -- Bùi Văn Hùng -> Toán THCS A2
(5, 20, 1, GETDATE()), -- Đỗ Thị Xuân -> Toán THCS A2

(6, 2, 1, GETDATE()), -- Nguyễn Thu Hà -> Văn Học Thiếu Nhi B2
(6, 14, 1, GETDATE()), -- Đặng Thị Mai -> Văn Học Thiếu Nhi B2
(6, 18, 1, GETDATE()), -- Ngô Thị Yến -> Văn Học Thiếu Nhi B2

(7, 4, 1, GETDATE()), -- Trần Thùy Linh -> Tiếng Anh Căn Bản C2
(7, 12, 1, GETDATE()), -- Vũ Thị Bảo -> Tiếng Anh Căn Bản C2
(7, 16, 1, GETDATE()), -- Bùi Thị Nhung -> Tiếng Anh Căn Bản C2

-- Thứ 4
(9, 2, 1, GETDATE()), -- Nguyễn Minh Đức -> Lý Nâng Cao A3
(9, 7, 1, GETDATE()), -- Phạm Văn Phúc -> Lý Nâng Cao A3
(9, 11, 1, GETDATE()), -- Vũ Đức Anh -> Lý Nâng Cao A3

(10, 5, 1, GETDATE()), -- Lê Hoàng Nam -> Toán Tư Duy B3
(10, 9, 1, GETDATE()), -- Hoàng Minh Tuấn -> Toán Tư Duy B3
(10, 13, 1, GETDATE()), -- Đặng Thành Long -> Toán Tư Duy B3
(10, 17, 1, GETDATE()), -- Ngô Đình Tài -> Toán Tư Duy B3

(11, 19, 1, GETDATE()), -- Đỗ Minh Hiếu -> Tiếng Anh IELTS C3

-- Thứ 5
(13, 3, 1, GETDATE()), -- Trần Minh Khang -> Văn THCS A4
(13, 6, 1, GETDATE()), -- Lê Thị Oanh -> Văn THCS A4
(13, 10, 1, GETDATE()), -- Hoàng Thị Vân -> Văn THCS A4
(13, 15, 1, GETDATE()), -- Bùi Văn Hùng -> Văn THCS A4

(14, 2, 1, GETDATE()), -- Nguyễn Minh Đức -> Toán Hình Học B4
(14, 7, 1, GETDATE()), -- Phạm Văn Phúc -> Toán Hình Học B4
(14, 11, 1, GETDATE()), -- Vũ Đức Anh -> Toán Hình Học B4

-- Thứ 6
(17, 5, 1, GETDATE()), -- Lê Hoàng Nam -> Lý Thí Nghiệm A5
(17, 9, 1, GETDATE()), -- Hoàng Minh Tuấn -> Lý Thí Nghiệm A5
(17, 13, 1, GETDATE()), -- Đặng Thành Long -> Lý Thí Nghiệm A5

(19, 2, 1, GETDATE()), -- Nguyễn Minh Đức -> Toán Ứng Dụng C5
(19, 3, 1, GETDATE()), -- Trần Minh Khang -> Toán Ứng Dụng C5
(19, 7, 1, GETDATE()), -- Phạm Văn Phúc -> Toán Ứng Dụng C5
(19, 17, 1, GETDATE()), -- Ngô Đình Tài -> Toán Ứng Dụng C5

-- Thứ 7
(21, 2, 1, GETDATE()), -- Nguyễn Thu Hà -> Văn Sáng Tác A6
(21, 6, 1, GETDATE()), -- Lê Thị Oanh -> Văn Sáng Tác A6
(21, 14, 1, GETDATE()), -- Đặng Thị Mai -> Văn Sáng Tác A6

(22, 5, 1, GETDATE()), -- Lê Hoàng Nam -> Toán Olimpic B6
(22, 9, 1, GETDATE()), -- Hoàng Minh Tuấn -> Toán Olimpic B6
(22, 19, 1, GETDATE()), -- Đỗ Minh Hiếu -> Toán Olimpic B6

(23, 11, 1, GETDATE()), -- Vũ Đức Anh -> Lập Trình Scratch C6
(23, 13, 1, GETDATE()), -- Đặng Thành Long -> Lập Trình Scratch C6
(23, 17, 1, GETDATE()), -- Ngô Đình Tài -> Lập Trình Scratch C6

-- Chủ nhật
(25, 2, 1, GETDATE()), -- Nguyễn Minh Đức -> Toán Tổng Hợp A7
(25, 3, 1, GETDATE()), -- Trần Minh Khang -> Toán Tổng Hợp A7
(25, 5, 1, GETDATE()), -- Lê Hoàng Nam -> Toán Tổng Hợp A7
(25, 7, 1, GETDATE()), -- Phạm Văn Phúc -> Toán Tổng Hợp A7
(25, 9, 1, GETDATE()), -- Hoàng Minh Tuấn -> Toán Tổng Hợp A7

(26, 10, 1, GETDATE()), -- Hoàng Thị Vân -> Khoa Học Tự Nhiên B7
(26, 12, 1, GETDATE()), -- Vũ Thị Bảo -> Khoa Học Tự Nhiên B7
(26, 16, 1, GETDATE()), -- Bùi Thị Nhung -> Khoa Học Tự Nhiên B7
(26, 20, 1, GETDATE()); -- Đỗ Thị Xuân -> Khoa Học Tự Nhiên B7

