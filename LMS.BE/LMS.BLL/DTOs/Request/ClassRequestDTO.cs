using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BLL.DTOs.Response
{
    public class ClassRequestDTO
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Subject { get; set; }
        [Required]
        public DayOfWeek DayOfWeek { get; set; }

        [Required]
        public TimeSpan StartTime { get; set; }

        [Required]
        public TimeSpan EndTime { get; set; }

        [Required]
        public string TeacherName { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int MaxStudents { get; set; }
    }

}
