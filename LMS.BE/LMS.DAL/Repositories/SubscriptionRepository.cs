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
    public class SubscriptionRepository : ISubscriptionRepository
    {
        private readonly ApplicationDbContext _context;

        public SubscriptionRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<List<Subscription>> GetSubscriptionPage()
        {
            return await _context.Subscriptions.ToListAsync();
        }

        public async Task<Subscription?> GetSubscriptionInfo(long id)
        {
            return await _context.Subscriptions
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<Subscription> SetSubscriptionInfo(Subscription subscription)
        {
            _context.Subscriptions.Add(subscription);
            await _context.SaveChangesAsync();
            return subscription;
        }

        public async Task<Subscription> UpdateSubscription(Subscription subscription)
        {
            _context.Subscriptions.Update(subscription);
            await _context.SaveChangesAsync();
            return subscription;
        }
    }
}
