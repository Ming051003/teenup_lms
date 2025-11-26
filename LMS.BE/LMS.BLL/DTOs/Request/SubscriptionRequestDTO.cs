using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BLL.DTOs.Request
{
    public class SubscriptionRequestDTO
    {
        [Required]
        public long StudentId { get; set; }

        [Required]
        public string PackageName { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int TotalSessions { get; set; }
    }
}
