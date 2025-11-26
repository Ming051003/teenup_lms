using AutoMapper;
using Azure.Core;
using LMS.BLL.BusinessInterfaces;
using LMS.BLL.DTOs.Request;
using LMS.BLL.DTOs.Response;
using LMS.DAL.Interfaces;
using LMS.DAL.Repositories;
using LMS.Model.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BLL.BusinessService
{
    public class ClassService : IClassService
    {
        private readonly IClassRepository _classRepository;
        private readonly IClassRegistrationRepository _classRegistrationRepository;
        private readonly IMapper _mapper;

        public ClassService(IClassRepository ClassRepository, IMapper mapper, IClassRegistrationRepository classRegistrationRepository)
        {
            _classRepository = ClassRepository;
            _mapper = mapper;
            _classRegistrationRepository = classRegistrationRepository;
        }
        public async Task<List<ClassResponseDTO>> GetClassPage()
        {
            var result = await _classRepository.GetClassPage();

            if (result == null || !result.Any())
                return new List<ClassResponseDTO>();

            return _mapper.Map<List<ClassResponseDTO>>(result);
        }
        public async Task<List<ClassResponseDTO>> GetClassByDay(DayOfWeek dayOfWeek)
        {
            var result = await _classRepository.GetClassByDay(dayOfWeek);

            if (result == null || !result.Any())
                return new List<ClassResponseDTO>();

            return _mapper.Map<List<ClassResponseDTO>>(result);
        }


        public async Task<ClassResponseDTO> SetClassInfo(ClassRequestDTO request)
        {
            if (request.EndTime <= request.StartTime)
                throw new InvalidOperationException("EndTime phải lớn hơn StartTime.");

            var entity = _mapper.Map<Class>(request);

            var created = await _classRepository.SetClassInfo(entity);

            return _mapper.Map<ClassResponseDTO>(created);
        }


        public async Task<ClassRegistrationResponseDTO> RegisterStudent(long classId, long studentId)
        {
            // 1. Check class tồn tại
            var Class = await _classRepository.GetClassInfo(classId);
            if (Class == null)
                throw new KeyNotFoundException("Class not found");

            // 2. Check đã đăng ký lớp này chưa
            if (await _classRegistrationRepository.IsStudentAlreadyRegistered(classId, studentId))
                throw new InvalidOperationException("Student đã đăng ký lớp này rồi.");

            // 3. Check full lớp
            var currentCount = await _classRegistrationRepository.GetActiveStudentCountInClass(classId);
            if (currentCount >= Class.MaxStudents)
                throw new InvalidOperationException("Lớp đã đủ số lượng học sinh.");

            // 4. Check trùng lịch
            bool hasConflict = await _classRegistrationRepository.HasScheduleConflict(studentId, Class.DayOfWeek,Class.StartTime,Class.EndTime);

            if (hasConflict)
                throw new InvalidOperationException("Student đã có lớp khác trong cùng khung giờ.");
            
            // 5. Tạo đăng ký
            var registration = new ClassRegistration
            {
                ClassId = classId,
                StudentId = studentId,
                Status = 1,
                RegisteredAt = DateTime.Now
            };

            var created = await _classRegistrationRepository.SetRegistrationInfo(registration);

            return _mapper.Map<ClassRegistrationResponseDTO>(created);
        }
    }
}
