namespace LMS.BLL.DTOs.Response
{
    public class StudentResponseDTO
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public DateTime DateOfBirth { get; set; }
        public int Gender { get; set; }
        public string CurrentGrade { get; set; }

        // Parent Info
        public long ParentId { get; set; }
        public ParentResponseDTO Parent { get; set; }
    }
}
