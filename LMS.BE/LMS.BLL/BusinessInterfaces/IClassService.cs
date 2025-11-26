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
    public interface IClassService
    {
        Task<List<ClassResponseDTO>> GetClassPage();
        Task<List<ClassResponseDTO>> GetClassByDay(DayOfWeek dayOfWeek);
        Task<ClassResponseDTO> SetClassInfo(ClassRequestDTO request);

        Task<ClassRegistrationResponseDTO> RegisterStudent(long classId, long studentId);


    }
}
