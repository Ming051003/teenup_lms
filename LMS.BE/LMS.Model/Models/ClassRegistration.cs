using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Model.Models
{
    public class ClassRegistration
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public long ClassId { get; set; }

        [ForeignKey("ClassId")]
        public Class Class { get; set; }

        [Required]
        public long StudentId { get; set; }

        [ForeignKey("StudentId")]

        [Required]
        public int Status { get; set; } = 1;
        public DateTime RegisteredAt { get; set; } = DateTime.Now;

        public Student Student { get; set; }
    }

}
