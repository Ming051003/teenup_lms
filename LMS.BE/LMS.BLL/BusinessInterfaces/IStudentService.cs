using LMS.BLL.DTOs.Request;
using LMS.BLL.DTOs.Response;
using LMS.Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BLL.BusinessInterfaces
{
    public interface IStudentService
    {
        Task<List<StudentResponseDTO>> GetStudentPage();
        Task<StudentResponseDTO> GetStudentInfo(long id);
        Task<StudentResponseDTO> SetStudentInfo(StudentRequestDTO StudentRequest);
        Task<StudentResponseDTO> UpdateStudentInfo(long id, StudentRequestDTO StudentRequest);
        Task<bool> DeleteStudentAsync(long id);

    }
}
