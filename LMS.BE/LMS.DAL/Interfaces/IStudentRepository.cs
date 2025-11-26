using LMS.Model.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.DAL.Interfaces
{
    public interface IStudentRepository
    {
        Task<List<Student>> GetStudentPage();
        Task<Student> GetStudentInfo(long id);
        Task<Student> SetStudentInfo(Student Student);
        Task<Student> UpdateStudentInfo(Student Student);
        Task<bool> DeleteStudent(long id);
    }
}
