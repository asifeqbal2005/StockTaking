using Herbal.Stock.API.Models;

namespace Herbal.Stock.API.Interfaces
{
    public interface ILocatorService
    {
        Task<bool> InsertLocator(LocatorRequestModel model);
        Task<bool> UpdateLocator(LocatorRequestModel model);
        Task<IEnumerable<LocatorResponseModel>> GetLocators();
        Task<bool> DeleteLocator(long locatorId);
    }
}
