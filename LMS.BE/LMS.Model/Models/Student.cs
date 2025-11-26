using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Model.Models
{
    public class Student
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime DateOfBirth { get; set; }

        [Required]
        public int Gender { get; set; }

        [Required]
        public string CurrentGrade { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
        public long ParentId { get; set; }

        [ForeignKey("ParentId")]
        public Parent Parent { get; set; }

        public List<ClassRegistration> ClassRegistrations { get; set; }
        public List<Subscription> Subscriptions { get; set; }

        
    }
}
