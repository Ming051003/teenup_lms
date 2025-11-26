using LMS.Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.DAL.Interfaces
{
    public interface IClassRegistrationRepository
    {
        Task<ClassRegistration> SetRegistrationInfo(ClassRegistration registration);

        Task<bool> IsStudentAlreadyRegistered(long classId, long studentId);

        Task<int> GetActiveStudentCountInClass(long classId);

        // Kiểm tra student có lớp nào trùng lịch không
        Task<bool> HasScheduleConflict(long studentId, DayOfWeek dayOfWeek,TimeSpan startTime,TimeSpan endTime);
    }
}
