using LMS.BLL.BusinessInterfaces;
using LMS.BLL.BusinessService;
using LMS.BLL.DTOs.Request;
using LMS.BLL.DTOs.Response;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LMS.API.Controllers
{
    [Route("api/subscriptions")]
    [ApiController]
    public class SubscriptionsController : ControllerBase
    {
        private readonly ISubscriptionService _subscriptionService;

        public SubscriptionsController(ISubscriptionService subscriptionService)
        {
            _subscriptionService = subscriptionService;
        }
        [HttpGet]
        public async Task<ActionResult<List<SubscriptionResponseDTO>>> GetSubscriptionsPage()
        {
            var classes = await _subscriptionService.GetSubscriptionPage();

            // Trả về 200 với list (có thể rỗng)
            return Ok(classes);
        }
        [HttpPost]
        public async Task<ActionResult<SubscriptionResponseDTO>> CreateSubscription(
            [FromBody] SubscriptionRequestDTO request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var created = await _subscriptionService.SetSubscriptionInfo(request);
                return Created($"/api/subscriptions/{created.Id}", created);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<SubscriptionResponseDTO>> GetSubscription(long id)
        {
            var sub = await _subscriptionService.GetSubscriptionInfo(id);
            if (sub == null)
                return NotFound(new { message = "Subscription not found." });

            return Ok(sub);
        }

        [HttpPatch("{id}/use")]
        public async Task<ActionResult<SubscriptionResponseDTO>> UseOneSession(long id)
        {
            try
            {
                var updated = await _subscriptionService.UseOneSession(id);
                return Ok(updated);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
