using AutoMapper;
using Azure.Core;
using LMS.BLL.BusinessInterfaces;
using LMS.BLL.DTOs.Request;
using LMS.BLL.DTOs.Response;
using LMS.DAL.Interfaces;
using LMS.Model.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BLL.BusinessService
{
    public class StudentService : IStudentService
    {
        private readonly IStudentRepository _StudentRepository;
        private readonly IParentRepository _ParentRepository;
        private readonly IMapper _mapper;

        public StudentService(IStudentRepository StudentRepository, IMapper mapper, IParentRepository parentRepository)
        {
            _StudentRepository = StudentRepository;
            _mapper = mapper;
            _ParentRepository = parentRepository;   
        }
        public async Task<List<StudentResponseDTO>> GetStudentPage()
        {
             var result = await _StudentRepository.GetStudentPage();
            if (result == null || !result.Any()) return null;

            return _mapper.Map<List<StudentResponseDTO>>(result);
        }


        public async Task<StudentResponseDTO> GetStudentInfo(long id)
        {
            var Student = await _StudentRepository.GetStudentInfo(id);
            if (Student == null) return null;

            return _mapper.Map<StudentResponseDTO>(Student);

        }

        public async Task<StudentResponseDTO> SetStudentInfo(StudentRequestDTO request)
        {
            var parent = await _ParentRepository.GetParentInfo(request.parentId);
            if (parent == null)
                throw new Exception($"Parent with id {request.parentId} not found");

            var Student = _mapper.Map<Student>(request);

            var created = await _StudentRepository.SetStudentInfo(Student);
            return _mapper.Map<StudentResponseDTO>(created);
        }

        public async Task<StudentResponseDTO> UpdateStudentInfo(long id, StudentRequestDTO request)
        {
            var Student = await _StudentRepository.GetStudentInfo(id);
            if (Student == null) return null;

            if (!string.IsNullOrEmpty(request.Name))
            {
                Student.Name = request.Name;
            }

            var updated = await _StudentRepository.UpdateStudentInfo(Student);

            return _mapper.Map<StudentResponseDTO>(updated);
        }

        public async Task<bool> DeleteStudentAsync(long id)
        {
            return await _StudentRepository.DeleteStudent(id);
        }
    }
}
