using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BLL.DTOs.Response
{
    public class ClassRegistrationResponseDTO
    {
        public long Id { get; set; }
        public long ClassId { get; set; }
        public long StudentId { get; set; }
        public int Status { get; set; }
        public DateTime RegisteredAt { get; set; }
    }
}
