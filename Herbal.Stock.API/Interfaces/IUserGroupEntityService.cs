using Herbal.Stock.API.Models;
using Herbalife.Stock.Core.Entities;

namespace Herbal.Stock.API.Interfaces
{
    public interface IUserGroupEntityService
    {
        Task<IEnumerable<UserGroupPermission>> SaveUserGroupEntity(UserGroupEntityRequestModel request);
        Task<IEnumerable<CustomDictionary>> GetUserGroups();
        Task<IEnumerable<UserGroupEntityResponseModel>> GetUserGroupEntitys();
        Task<IEnumerable<EntityDropdownData>> GetEntities();
        Task<UserGroupEntityUpdateResponseModel> GetUserGroupEntityByGroupId(long groupId);       
    }
}
