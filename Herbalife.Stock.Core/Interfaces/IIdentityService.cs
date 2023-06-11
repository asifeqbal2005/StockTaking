using Herbalife.Stock.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Herbalife.Stock.Core.Interfaces
{
    public interface IIdentityService
    {
        Task<ClaimHandler> GetLoggedInUser();
        Task<ClaimHandler> AddUser(ClaimHandler cl);        
        Task<List<UserGroupPermission>> GetUserGroupPermissions(long userId);
        IList<string> GetCurrentUserRole();
        Task<List<EntityMaster>> GetUserAdminGroupPermissions();
    }
}
