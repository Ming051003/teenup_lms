using LMS.DAL.Interfaces;
using LMS.Model;
using LMS.Model.Models;
using Microsoft.EntityFrameworkCore;

namespace LMS.DAL.Repositories
{
    public class StudentRepository : IStudentRepository
    {
        private readonly ApplicationDbContext _context;

        public StudentRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<List<Student>> GetStudentPage()
        {
            return await _context.Students
                .Include(s => s.Parent)
                .ToListAsync();
        }
        public async Task<Student> GetStudentInfo(long id)
        {
            return await _context.Students
                .Include(s => s.Parent)
                .FirstOrDefaultAsync(s => s.Id == id);
        }
        public async Task<Student> SetStudentInfo(Student Student)
        {
            _context.Students.Add(Student);
            await _context.SaveChangesAsync();
            return Student;
        }

        public async Task<Student> UpdateStudentInfo(Student Student)
        {
            _context.Students.Update(Student);
            await _context.SaveChangesAsync();
            return Student;
        }

        public async Task<bool> DeleteStudent(long id)
        {
            var Student = await GetStudentInfo(id);
            if (Student == null) return false;

            _context.Students.Remove(Student);
            await _context.SaveChangesAsync();
            return true;
        }     
    }
}
