using LMS.Model.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.DAL.Interfaces
{
    public interface IClassRepository
    {
        Task<List<Class>> GetClassPage();
        Task<List<Class>> GetClassByDay(DayOfWeek dayOfWeek);
        Task<Class> GetClassInfo(long id);
        Task<Class> SetClassInfo(Class Class);
        Task<Class> UpdateClassInfo(Class Class);
        Task<bool> DeleteClass(long id);
    }
}
