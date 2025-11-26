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
    public interface ISubscriptionService
    {
        Task<List<SubscriptionResponseDTO>> GetSubscriptionPage();
        Task<SubscriptionResponseDTO> SetSubscriptionInfo(SubscriptionRequestDTO subscription);
        Task<SubscriptionResponseDTO?> GetSubscriptionInfo(long id);
        Task<SubscriptionResponseDTO> UseOneSession(long id);
    }
}
