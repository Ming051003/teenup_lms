using LMS.DAL.Interfaces;
using LMS.Model;
using LMS.Model.Models;
using Microsoft.EntityFrameworkCore;

namespace LMS.DAL.Repositories
{
    public class ClassRepository : IClassRepository
    {
        private readonly ApplicationDbContext _context;

        public ClassRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<List<Class>> GetClassPage()
        {
            return await _context.Classes.ToListAsync();
        }
        public async Task<List<Class>> GetClassByDay(DayOfWeek dayOfWeek)
        {
            return await _context.Classes
                .Where(c => c.DayOfWeek == dayOfWeek)
                .ToListAsync();
        }
        public async Task<Class> GetClassInfo(long id)
        {
            return await _context.Classes.FindAsync(id);
        }
        public async Task<Class> SetClassInfo(Class Class)
        {
            _context.Classes.Add(Class);
            await _context.SaveChangesAsync();
            return Class;
        }

        public async Task<Class> UpdateClassInfo(Class Class)
        {
            _context.Classes.Update(Class);
            await _context.SaveChangesAsync();
            return Class;
        }

        public async Task<bool> DeleteClass(long id)
        {
            var Class = await GetClassInfo(id);
            if (Class == null) return false;

            _context.Classes.Remove(Class);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
