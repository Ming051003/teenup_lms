using System;
using LMS.BLL.BusinessInterfaces;
using LMS.BLL.DTOs.Request;
using LMS.BLL.DTOs.Response;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LMS_Server.Controllers
{
    [Route("api/parents")]
    [ApiController]
    public class ParentsController : ControllerBase
    {
        private readonly IParentService _parentService;

        public ParentsController(IParentService parentService)
        {
            _parentService = parentService;
        }
        [HttpGet]
        public async Task<ActionResult<List<ParentResponseDTO>>> GetParentPage()
        {
            var parents = await _parentService.GetParentPage();
            return Ok(parents);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ParentResponseDTO>> GetParentInfo(long id)
        {
            var parent = await _parentService.GetParentInfo(id);

            if (parent == null)
                return NotFound(new { message = "Parent not found" });

            return Ok(parent);
        }

        [HttpPost]
        public async Task<ActionResult<ParentResponseDTO>> SetParentInfo([FromBody] ParentRequestDTO parentRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var created = await _parentService.SetParentInfo(parentRequest);
                return CreatedAtAction(nameof(GetParentInfo), new { id = created.Id }, created);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ParentResponseDTO>> UpdateParent(long id, [FromBody] ParentRequestDTO parentRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var updated = await _parentService.UpdateParentInfo(id, parentRequest);

                if (updated == null)
                    return NotFound(new { message = "Parent not found" });

                return Ok(updated);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteParent(long id)
        {
            var success = await _parentService.DeleteParentAsync(id);

            if (!success)
                return NotFound(new { message = "Parent not found" });

            return Ok(new { message = "Deleted successfully" });
        }
    }
}
