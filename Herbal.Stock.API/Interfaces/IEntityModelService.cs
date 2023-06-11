using Herbal.Stock.API.Models;

namespace Herbal.Stock.API.Interfaces
{
    public interface IEntityModelService
    {
        Task<IEnumerable<EntityResponseModel>> GetEntities();
        Task<IEnumerable<EntityParentChildResponseModel>> GetParentChildMenu();
        Task<EntityResponseModel> GetEntityById(long id);
        Task<bool> SaveEntity(EntityRequestModel model);
        Task<bool> UpdateEntity(EntityRequestModel model);
        Task DeleteEntityById(long id);
        Task<IEnumerable<CustomDictionary>> GetParentEntities();
    }
}
