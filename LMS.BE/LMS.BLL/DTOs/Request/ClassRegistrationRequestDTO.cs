using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BLL.DTOs.Response
{
    public class ClassRegisterRequestDTO
    {
        [Required]
        public long StudentId { get; set; }
    }
}
