using Herbal.Stock.API.Models;

namespace Herbal.Stock.API.Interfaces
{
    public interface ICountryService
    {
        Task<IEnumerable<CountryResponseModel>> GetCountries();
        Task<CountryResponseModel> GetCountryById(long countryId);
        Task<string> AddCountry(CountryRequestModel model);
        Task<string> UpdateCountry(CountryRequestModel model);
        Task<bool> DeleteCountry(long id);
    }
}
