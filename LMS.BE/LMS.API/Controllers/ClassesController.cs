using LMS.BLL.BusinessInterfaces;
using LMS.BLL.BusinessService;
using LMS.BLL.DTOs.Request;
using LMS.BLL.DTOs.Response;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LMS_Server.Controllers
{
    [Route("api/classes/")]
    [ApiController]
    public class ClassesController : ControllerBase
    {
        private readonly IClassService _classService;

        public ClassesController(IClassService classService)
        {
            _classService = classService;
        }
        [HttpGet]
        public async Task<ActionResult<List<ClassResponseDTO>>> GetClassesPage()
        {
            var classes = await _classService.GetClassPage();

            // Trả về 200 với list (có thể rỗng)
            return Ok(classes);
        }
        [HttpGet("by-day")]
        public async Task<ActionResult<List<ClassResponseDTO>>> GetClassesByDay([FromQuery] string day)
        {
            if (string.IsNullOrWhiteSpace(day))
                return BadRequest(new { message = "Query 'day' là bắt buộc. VD: /api/classes?day=Monday" });

            if (!Enum.TryParse<DayOfWeek>(day, true, out var dayOfWeek))
                return BadRequest(new { message = "Giá trị 'day' không hợp lệ. Hãy dùng: Monday, Tuesday, Wednesday, ..." });

            var classes = await _classService.GetClassByDay(dayOfWeek);

            // Trả về 200 với list (có thể rỗng)
            return Ok(classes);
        }
        [HttpPost]
        public async Task<ActionResult<ClassResponseDTO>> SetClassInfo([FromBody] ClassRequestDTO classRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var created = await _classService.SetClassInfo(classRequest);

                return Created($"/api/classes/{created.Id}", created);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

       


        [HttpPost("{classId}/register")]
        public async Task<ActionResult<ClassRegistrationResponseDTO>> RegisterStudent(
            long classId,
            [FromBody] ClassRegisterRequestDTO request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await _classService.RegisterStudent(classId, request.StudentId);

                return Created(
                    $"/api/classes/{classId}/register/{result.Id}",
                    result);
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
