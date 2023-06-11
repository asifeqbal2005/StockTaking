using Herbal.Stock.API.Models;

namespace Herbal.Stock.API.Interfaces
{
    public interface IUserGropViewModelService
    {
        Task<List<UserGroupResponseModel>> GetAllUserGroup();
        Task<List<ClaimHandlerResponseModel>> GetAllClaimHandler(UserGroupResquestModel model);
        Task<List<UserGroupResponseModel>> GetAssignedUserGroup(UserGroupResquestModel model);
        Task<List<ManageUserResponseModel>> GetClaimHandlers();
        Task<bool> CreateUserGroup(UserGroupResquestModel model);
        Task<bool> UpdateUserGroup(UserGroupResquestModel model);
        Task<bool> DeleteUserGroup(UserGroupResquestModel model);
    }
}
