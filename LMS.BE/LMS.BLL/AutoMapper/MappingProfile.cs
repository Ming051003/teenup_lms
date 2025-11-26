using AutoMapper;
using LMS.BLL.DTOs.Request;
using LMS.BLL.DTOs.Response;
using LMS.Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.BLL.AutoMapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Ánh xạ từ Parent Entity sang ParentResponseDTO
            CreateMap<Parent, ParentResponseDTO>();
                //.ForMember(dest => dest.Students, opt => opt.MapFrom(src => src.Students));  // Nếu bạn muốn ánh xạ danh sách học sinh

            // Ánh xạ từ ParentRequestDTO sang Parent Entity
            CreateMap<ParentRequestDTO, Parent>();

            // Ánh xạ từ Student Entity sang StudentResponseDTO
            CreateMap<Student, StudentResponseDTO>()
                .ForMember(dest => dest.ParentId, opt => opt.MapFrom(src => src.ParentId)) // Ánh xạ phụ huynh
                .ForMember(dest => dest.Parent, opt => opt.MapFrom(src => src.Parent));


            // Ánh xạ từ StudentRequestDTO sang Student Entity
            CreateMap<StudentRequestDTO, Student>();

            // Ánh xạ từ StudentRequestDTO sang Student Entity
            CreateMap<ClassRequestDTO, Class>();

            // Ánh xạ từ Class Entity sang ClassResponseDTO
            CreateMap<Class, ClassResponseDTO>();

            // Ánh xạ từ ClassRegistration Entity sang ClassResponseDTO
            CreateMap<ClassRegistration, ClassRegistrationResponseDTO>();

            // Ánh xạ từ Subscription Entity sang SubscriptionResponseDTO
            CreateMap<Subscription, SubscriptionResponseDTO>();

            //// Ánh xạ từ SubscriptionRequestDTO sang Subscription Entity
            //CreateMap<SubscriptionRequestDTO, Subscription>();

        }
    }
}
