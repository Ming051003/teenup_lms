using AutoMapper;
using LMS.API.Extensions;
using LMS.BLL.AutoMapper;
using LMS.Model;
using Microsoft.EntityFrameworkCore;

namespace LMS.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Tự chọn file appsettings.*.json theo môi trường (Development/Production)
            builder.Configuration
               .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
               .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
               .AddEnvironmentVariables();

            // Đăng ký DbContext với SQL Server và bật hoặc tắt logging dữ liệu nhạy cảm dựa trên môi trường
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
            {
                var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
                options.UseSqlServer(connectionString);

                // EnableSensitiveDataLogging chỉ bật trong môi trường phát triển
                if (builder.Environment.IsDevelopment())
                {
                    options.EnableSensitiveDataLogging();
                }
            });

            // Đăng ký các service custom (ví dụ, các dịch vụ nghiệp vụ, AutoMapper, v.v.)
            builder.Services.RegisterServices(builder.Configuration);

            // Cấu hình AutoMapper cho việc ánh xạ đối tượng
            builder.Services.AddAutoMapper(typeof(MappingProfile));

            // Đăng ký các controller API
            builder.Services.AddControllers();

            // Cấu hình Swagger/OpenAPI cho việc test API qua giao diện UI
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Cấu hình CORS để cho phép frontend từ các domain cụ thể
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



            // Xây dựng ứng dụng
            var app = builder.Build();

            // Cấu hình pipeline HTTP request
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();  // Cấu hình Swagger trong môi trường phát triển
                app.UseSwaggerUI();  // Cung cấp giao diện người dùng cho Swagger
            }

            app.UseHttpsRedirection();  // Chuyển hướng tất cả yêu cầu HTTP sang HTTPS
            app.UseRouting();  // Kích hoạt routing cho các controller
            app.UseCors("AllowFrontend");
            app.UseAuthorization();  // Cấu hình xác thực và ủy quyền

            app.MapControllers();  // Map các controller API vào pipeline

            app.Run();  // Chạy ứng dụng
        }
    }
}
