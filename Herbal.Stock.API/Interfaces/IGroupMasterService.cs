using Herbal.Stock.API.Models;

namespace Herbal.Stock.API.Interfaces
{
    public interface IGroupMasterService
    {
        Task<List<GroupMasterResponseModel>> GetUserGroupList();
    }
}
