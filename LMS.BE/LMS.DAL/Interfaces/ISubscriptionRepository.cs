using LMS.Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.DAL.Interfaces
{
    public interface ISubscriptionRepository
    {
        Task<List<Subscription>> GetSubscriptionPage();
        Task<Subscription> SetSubscriptionInfo(Subscription subscription);
        Task<Subscription?> GetSubscriptionInfo(long id);
        Task<Subscription> UpdateSubscription(Subscription subscription);
    }
}
