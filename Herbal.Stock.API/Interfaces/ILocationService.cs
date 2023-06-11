using Herbal.Stock.API.Models;

namespace Herbal.Stock.API.Interfaces
{
    public interface ILocationService
    {
        Task<bool> InsertLocation(LocationRequestModel model);
        Task<bool> UpdateLocation(LocationRequestModel model);
        Task<IEnumerable<LocationResponseModel>> GetLocations();
        Task<bool> DeleteLocation(long locationId);
    }
}
