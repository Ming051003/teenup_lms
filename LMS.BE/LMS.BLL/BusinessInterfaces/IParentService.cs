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
    public interface IParentService
    {
        Task<List<ParentResponseDTO>> GetParentPage();
        Task<ParentResponseDTO> GetParentInfo(long id);
        Task<ParentResponseDTO> SetParentInfo(ParentRequestDTO parentRequest);
        Task<ParentResponseDTO> UpdateParentInfo(long id, ParentRequestDTO parentRequest);
        Task<bool> DeleteParentAsync(long id);

    }
}
