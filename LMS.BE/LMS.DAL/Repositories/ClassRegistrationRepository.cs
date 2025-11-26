using LMS.DAL.Interfaces;
using LMS.Model;
using LMS.Model.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.DAL.Repositories
{
    public class ClassRegistrationRepository : IClassRegistrationRepository
    {
        private readonly ApplicationDbContext _context;

        public ClassRegistrationRepository(ApplicationDbContext context)
        {
            _context = context;
        }         

        public async Task<ClassRegistration> SetRegistrationInfo(ClassRegistration registration)
        {
            _context.ClassRegistrations.AddAsync(registration);
            await _context.SaveChangesAsync();
            return registration;
        }
        public async Task<bool> IsStudentAlreadyRegistered(long classId, long studentId)
        {
            return await _context.ClassRegistrations
                .AnyAsync(cr => cr.ClassId == classId && cr.StudentId == studentId && cr.Status == 1);
        }
        public async Task<int> GetActiveStudentCountInClass(long classId)
        {
            return await _context.ClassRegistrations
                .CountAsync(cr => cr.ClassId == classId && cr.Status == 1);
        }
        public async Task<bool> HasScheduleConflict(long studentId, DayOfWeek dayOfWeek, TimeSpan startTime, TimeSpan endTime)
        {
            return await _context.ClassRegistrations
                           .Include(cr => cr.Class)
                           .AnyAsync(cr =>
                               cr.StudentId == studentId &&
                               cr.Status == 1 &&
                               cr.Class.DayOfWeek == dayOfWeek &&
                               cr.Class.StartTime < endTime &&
                               startTime < cr.Class.EndTime);
        }

    }
}
