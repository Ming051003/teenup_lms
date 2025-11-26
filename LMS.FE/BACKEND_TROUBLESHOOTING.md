# Hướng dẫn khắc phục lỗi ERR_CONNECTION_REFUSED

## Nguyên nhân có thể:

### 1. **CORS (Cross-Origin Resource Sharing) chưa được cấu hình**

Backend cần cho phép frontend domain truy cập. Kiểm tra backend có cấu hình CORS:

**Nếu backend là .NET (ASP.NET Core):**
```csharp
// Program.cs hoặc Startup.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "https://teenup-c2911.web.app",
            "http://localhost:5173",
            "http://localhost:3000"
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

// Sau đó apply middleware
app.UseCors("AllowFrontend");
```

**Nếu backend là Node.js/Express:**
```javascript
const cors = require('cors');
app.use(cors({
  origin: [
    'https://teenup-c2911.web.app',
    'http://localhost:5173'
  ],
  credentials: true
}));
```

### 2. **Backend chưa được deploy hoặc không chạy**

Kiểm tra:
- Backend có đang chạy trên `https://lmsteenup.runasp.net` không?
- Thử truy cập trực tiếp: `https://lmsteenup.runasp.net/api/students` (hoặc endpoint nào đó)
- Kiểm tra logs của backend server

### 3. **SSL/HTTPS Issues**

- Đảm bảo backend có SSL certificate hợp lệ
- Kiểm tra certificate có expired không
- Frontend (HTTPS) chỉ có thể gọi backend HTTPS (không thể gọi HTTP)

### 4. **Firewall hoặc Network Configuration**

- Kiểm tra firewall có chặn port không
- Kiểm tra server có cho phép incoming connections không
- Kiểm tra load balancer/proxy configuration

### 5. **API Base Path không đúng**

Kiểm tra:
- Backend API có đúng path `/api` không?
- Có thể backend không có prefix `/api`, cần sửa frontend URL

## Cách kiểm tra nhanh:

1. **Mở browser console** (F12) và xem error chi tiết
2. **Thử gọi API trực tiếp** trong browser:
   ```
   https://lmsteenup.runasp.net/api/students
   ```
3. **Kiểm tra Network tab** trong DevTools để xem:
   - Request có được gửi đi không?
   - Response status code là gì?
   - CORS error hay connection refused?

## Debug trong Frontend:

Thêm vào `api-client.ts` để debug:
```typescript
console.log('API Base URL:', apiUrl);
console.log('Is Production:', import.meta.env.PROD);
```

## Sau khi sửa backend:

1. **Rebuild frontend:**
   ```bash
   npm run build
   ```

2. **Deploy lại:**
   ```bash
   firebase deploy --only hosting
   ```

