using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BLL.DTOs.Response
{
    public class SubscriptionResponseDTO
    {
        public long Id { get; set; }

        public long StudentId { get; set; }

        public string PackageName { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public int TotalSessions { get; set; }

        public int UsedSessions { get; set; }

        public int Status { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}
