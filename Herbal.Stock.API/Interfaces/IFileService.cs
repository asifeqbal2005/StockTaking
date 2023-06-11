using Herbal.Stock.API.Models;
using Herbalife.Stock.Core.Entities;

namespace Herbal.Stock.API.Interfaces
{
    public interface IFileService
    {
        Task<List<InventoryResponseModel>> UploadWMSInventoryAsync(IFormFile fileData);
        Task<List<InventoryResponseModel>> GetInventoryDetails();
        Task<List<string?>> GetRowDataToFilter();
        Task<List<SupervisorInventoryResponse>> GetSupervisorInventoryData();        
        Task<bool> UpdateInventoryData(UpdateInventoryModel model);
        Task<List<StockOnHandInventoryModel>> GetStockOnHandInventory();
        Task<List<InventoryDtoModel>> UploadOracleInventoryAsync(IFormFile fileData);
    }
}
