using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BLL.DTOs.Request
{
    public class ClassResponseDTO
    {
        public long Id { get; set; }

        public string Name { get; set; }

        public string Subject { get; set; }

        public DayOfWeek DayOfWeek { get; set; }

        public TimeSpan StartTime { get; set; }

        public TimeSpan EndTime { get; set; }

        public string TeacherName { get; set; }

        public int MaxStudents { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }

}
