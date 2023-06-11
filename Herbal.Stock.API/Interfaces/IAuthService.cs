using Herbal.Stock.API.Models;

namespace Herbal.Stock.API.Interfaces
{
    public interface IAuthService
    {
        Task<ApplicationUserModel?> GetLoggedInUser(GraphApiToken input);
    }
}
