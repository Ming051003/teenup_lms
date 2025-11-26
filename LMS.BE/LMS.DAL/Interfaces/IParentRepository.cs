using LMS.Model.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.DAL.Interfaces
{
    public interface IParentRepository
    {
        Task<List<Parent>> GetParentPage();
        Task<Parent?> GetParentInfo(long id);
        Task<Parent> SetParentInfo(Parent parent);
        Task<Parent> UpdateParentInfo(Parent parent);
        Task<bool> DeleteParent(long id);
        Task<bool> ExistsByEmail(string email);
        Task<bool> ExistsByPhone(string phone);

    }
}
