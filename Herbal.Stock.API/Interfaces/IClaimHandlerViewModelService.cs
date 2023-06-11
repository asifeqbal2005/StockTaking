using Herbal.Stock.API.Models;

namespace Herbal.Stock.API.Interfaces
{
    public interface IClaimHandlerViewModelService
    {
        Task<IEnumerable<ClaimHandlerResponseModel>> GetClaimHandlersAsync();
        Task<IEnumerable<ClaimHandlerResponseModel>> GetClaimHandlers(long organisationId, bool IncludeInActive = false);
        Task<ClaimHandlerResponseModel> GetClaimHandler(long claimHandlerId);
        Task<ClaimHandlerResponseModel> AddClaimHandlers(ClaimHandlerRequestModel claimHandlerRequestModel);
        Task<ClaimHandlerResponseModel> PutClaimHandlers(ClaimHandlerRequestModel claimHandlerRequestModel);
        Task<long?> GetAutoClaimsHandlerId(long handlingOrganizationId);
    }
}
