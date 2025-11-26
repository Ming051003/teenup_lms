using LMS.DAL.Interfaces;
using LMS.Model;
using LMS.Model.Models;
using Microsoft.EntityFrameworkCore;

namespace LMS.DAL.Repositories
{
    public class ParentRepository : IParentRepository
    {
        private readonly ApplicationDbContext _context;

        public ParentRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<List<Parent>> GetParentPage()
        {
            return await _context.Parents.ToListAsync();
        }
        public async Task<Parent?> GetParentInfo(long id)
        {
            return await _context.Parents.FindAsync(id);
        }
        public async Task<Parent> SetParentInfo(Parent parent)
        {
            _context.Parents.Add(parent);
            await _context.SaveChangesAsync();
            return parent;
        }

        public async Task<Parent> UpdateParentInfo(Parent parent)
        {
            _context.Parents.Update(parent);
            await _context.SaveChangesAsync();
            return parent;
        }

        public async Task<bool> DeleteParent(long id)
        {
            var parent = await GetParentInfo(id);
            if (parent == null) return false;

            _context.Parents.Remove(parent);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> ExistsByEmail(string email)
        {
            return await _context.Parents.AnyAsync(p => p.Email == email);
        }

        public async Task<bool> ExistsByPhone(string phone)
        {
            return await _context.Parents.AnyAsync(p => p.Phone == phone);
        }

    }
}
