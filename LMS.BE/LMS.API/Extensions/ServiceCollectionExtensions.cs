
using LMS.BLL.BusinessInterfaces;
using LMS.BLL.BusinessService;
using LMS.BLL.BusinessInterfaces;
using LMS.DAL.Interfaces;
using LMS.DAL.Repositories;

namespace LMS.API.Extensions
{
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Service
        /// </summary>
        /// <param name="services"></param>
        /// <param name="configuration"></param>
        /// <returns></returns>
        public static IServiceCollection RegisterServices(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddSingleton(configuration);

            //repository
            services.AddScoped<IParentRepository, ParentRepository>();
            services.AddScoped<IStudentRepository, StudentRepository>();
            services.AddScoped<IClassRepository, ClassRepository>();
            services.AddScoped<IClassRegistrationRepository, ClassRegistrationRepository>();
            services.AddScoped<ISubscriptionRepository, SubscriptionRepository>();



            //services
            services.AddScoped < IParentService, ParentService>();
            services.AddScoped < IStudentService, StudentService>();
            services.AddScoped < IClassService, ClassService>();
            services.AddScoped<ISubscriptionService, SubscriptionService>();


            return services;
        }
    }
}