using LMS.BLL.BusinessInterfaces;
using LMS.BLL.DTOs.Request;
using LMS.BLL.DTOs.Response;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LMS_Server.Controllers
{
    [Route("api/students")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly IStudentService _StudentService;

        public StudentsController(IStudentService StudentService)
        {
            _StudentService = StudentService;
        }
        [HttpGet]
        public async Task<ActionResult<List<StudentResponseDTO>>> GetStudentPage()
        {
            var Students = await _StudentService.GetStudentPage();
            return Ok(Students);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StudentResponseDTO>> GetStudentInfo(long id)
        {
            var Student = await _StudentService.GetStudentInfo(id);

            if (Student == null)
                return NotFound(new { message = "Student not found" });

            return Ok(Student);
        }

        [HttpPost]
        public async Task<ActionResult<StudentResponseDTO>> CreateStudent([FromBody] StudentRequestDTO StudentRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _StudentService.SetStudentInfo(StudentRequest);

            return CreatedAtAction(nameof(GetStudentInfo), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<StudentResponseDTO>> UpdateStudent(long id, [FromBody] StudentRequestDTO StudentRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _StudentService.UpdateStudentInfo(id, StudentRequest);

            if (updated == null)
                return NotFound(new { message = "Student not found" });

            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteStudent(long id)
        {
            var success = await _StudentService.DeleteStudentAsync(id);

            if (!success)
                return NotFound(new { message = "Student not found" });

            return Ok(new { message = "Deleted successfully" });
        }
    }
}
