using AutoMapper;
using Azure.Core;
using LMS.BLL.BusinessInterfaces;
using LMS.BLL.DTOs.Request;
using LMS.BLL.DTOs.Response;
using LMS.DAL.Interfaces;
using LMS.DAL.Repositories;
using LMS.Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BLL.BusinessService
{
    public class SubscriptionService : ISubscriptionService
    {
        private readonly ISubscriptionRepository _subscriptionRepository;
        private readonly IMapper _mapper;

        public SubscriptionService(
            ISubscriptionRepository subscriptionRepository,
            IMapper mapper)
        {
            _subscriptionRepository = subscriptionRepository;
            _mapper = mapper;
        }
        public async Task<List<SubscriptionResponseDTO>> GetSubscriptionPage()
        {
            var result = await _subscriptionRepository.GetSubscriptionPage();

            if (result == null || !result.Any())
                return new List<SubscriptionResponseDTO>();

            return _mapper.Map<List<SubscriptionResponseDTO>>(result);
        }

        public async Task<SubscriptionResponseDTO?> GetSubscriptionInfo(long id)
        {
            var sub = await _subscriptionRepository.GetSubscriptionInfo(id);
            if (sub == null) return null;

            return _mapper.Map<SubscriptionResponseDTO>(sub);
        }

        public async Task<SubscriptionResponseDTO> SetSubscriptionInfo(SubscriptionRequestDTO subscription)
        {
            if (subscription.EndDate < subscription.StartDate)
                throw new InvalidOperationException("EndDate phải lớn hơn hoặc bằng StartDate.");
            var entity = new Subscription
            {
                StudentId = subscription.StudentId,
                PackageName = subscription.PackageName,
                StartDate = subscription.StartDate,
                EndDate = subscription.EndDate,
                TotalSessions = subscription.TotalSessions,
                UsedSessions = 0,
                Status = 1, 
                CreatedAt = DateTime.Now
            };
            var created = await _subscriptionRepository.SetSubscriptionInfo(entity);

            return _mapper.Map<SubscriptionResponseDTO>(created);
        }

        public async Task<SubscriptionResponseDTO> UseOneSession(long id)
        {
            var sub = await _subscriptionRepository.GetSubscriptionInfo(id);
            if (sub == null)
                throw new KeyNotFoundException("Subscription không tồn tại.");
            //Kiểm tra hết hạn (EndDate < hôm nay)
            if (DateTime.Now.Date > sub.EndDate.Date)
            {
                if (sub.Status != 0)
                {
                    sub.Status = 0; 
                    sub.UpdatedAt = DateTime.Now;
                    await _subscriptionRepository.UpdateSubscription(sub);
                }

                throw new InvalidOperationException("Subscription đã hết hạn.");
            }

            if (sub.Status != 1)
                throw new InvalidOperationException("Subscription không còn hoạt động.");

            //Kiểm tra nếu đã dùng hết buổi rồi 
            if (sub.UsedSessions >= sub.TotalSessions)
            {
                if (sub.Status != 2)
                {
                    sub.Status = 2;
                    sub.UpdatedAt = DateTime.Now;
                    await _subscriptionRepository.UpdateSubscription(sub);
                }

                throw new InvalidOperationException("Subscription đã dùng hết số buổi.");
            }

            sub.UsedSessions += 1;
            sub.UpdatedAt = DateTime.Now;

            // Nếu vừa dùng xong buổi cuối
            if (sub.UsedSessions == sub.TotalSessions)
            {
                sub.Status = 2; 
            }

            var updated = await _subscriptionRepository.UpdateSubscription(sub);

            return _mapper.Map<SubscriptionResponseDTO>(updated);
        }

    }
}
