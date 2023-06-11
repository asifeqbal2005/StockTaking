using AutoMapper;
using Herbal.Stock.API.Enums;
using Herbal.Stock.API.Interfaces;
using Herbal.Stock.API.Models;
using Herbalife.Stock.Core.Entities;
using Herbalife.Stock.Core.Interfaces;
using Herbalife.Stock.Core.Services;
using Herbalife.Stock.Core.Specifications;
using Microsoft.Graph;

namespace Herbal.Stock.API.Services
{
    public class CountryService : ICountryService
    {
        private readonly IAsyncRepository<Country> _itemRepository;        
        private readonly IMapper _mapper;

        public CountryService(IAsyncRepository<Country> itemRepository, IMapper mapper)
        {
            _mapper = mapper;
            _itemRepository = itemRepository;            
        }

        public async Task<IEnumerable<CountryResponseModel>> GetCountries()
        {
            var filterSpecification = new CountrySpecifications();
            var items = await _itemRepository.ListAsync(filterSpecification);
            var data = items.OrderBy(p => p.ID).ToList();
            return data.Select(input => new CountryResponseModel
            {
                ID = input.ID,
                CountryName = input.CountryName
            });

        }

        public async Task<CountryResponseModel> GetCountryById(long countryId)
        {
            var filterSpecification = new CountrySpecifications(countryId);
            var input = await _itemRepository.ListAsync(filterSpecification);
            return new CountryResponseModel
            {
                ID = input.FirstOrDefault()?.ID,
                CountryName = input.FirstOrDefault()?.CountryName
            };
        }

        public async Task<string> AddCountry(CountryRequestModel model)
        {
            string status = string.Empty;
            var countryExist = await _itemRepository.FindByPredicate(c => c.CountryName == model.CountryName && c.IsDelete == false);
            if (countryExist != null && countryExist.Any())
            {
                status = StatusCode.Duplicate.ToString();
            }
            else
            {
                var countryRequest = _mapper.Map<Country>(model);
                var item = await _itemRepository.AddAsync(countryRequest);
                if (item != null)
                {
                    status = StatusCode.Success.ToString();
                }
                else
                {
                    status = StatusCode.Fail.ToString();
                }
            }
            return status;
        }

        public async Task<string> UpdateCountry(CountryRequestModel model)
        {
            string status = string.Empty;
            var countryExist = await _itemRepository.FindByPredicate(c => c.CountryName == model.CountryName && c.IsDelete == false);
            if (countryExist != null && countryExist.Any() && countryExist.FirstOrDefault(k => k.ID != model.ID) != null)
            {
                status = StatusCode.Duplicate.ToString();
            }
            else
            {
                var countryRequest = _mapper.Map<Country>(model);
                await _itemRepository.UpdateAsync(countryRequest);
                status = StatusCode.Success.ToString();
            }
            return status;

        }

        public async Task<bool> DeleteCountry(long id)
        {
            var item = await _itemRepository.GetByIdAsync(id);
            if (item == null)
            {
                return false;
            }
            else
            {
                item.IsDelete = true;
                await _itemRepository.UpdateAsync(item);
                return true;
            }            
        }
    }
}
