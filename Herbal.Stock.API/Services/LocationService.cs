using AutoMapper;
using Herbal.Stock.API.Interfaces;
using Herbal.Stock.API.Models;
using Herbalife.Stock.Core.Entities;
using Herbalife.Stock.Core.Interfaces;
using Herbalife.Stock.Core.Specifications;

namespace Herbal.Stock.API.Services
{
    public class LocationService : ILocationService
    {
        private readonly IAsyncRepository<Location> _itemRepository;
        private readonly IMapper _mapper;

        public LocationService(IAsyncRepository<Location> itemRepository, IMapper mapper) 
        { 
            _itemRepository = itemRepository;
            _mapper = mapper;
        }       

        public async Task<bool> InsertLocation(LocationRequestModel model)
        {
            bool result = false;
            var locationRequest = _mapper.Map<Location>(model);
            var item = await _itemRepository.AddAsync(locationRequest);
            if(item != null)
            {
                result = true;
            }
            return result;
        }

        public async Task<bool> UpdateLocation(LocationRequestModel model)
        {
            var locationRequest = _mapper.Map<Location>(model);
            await _itemRepository.UpdateAsync(locationRequest);
            return true;
        }

        public async Task<IEnumerable<LocationResponseModel>> GetLocations()
        {
            var filterSpecification = new LocationFilterSpecification();
            var items = await _itemRepository.ListAsync(filterSpecification);
            var data = items.OrderBy(p => p.ID).ToList();
            return data.Select(input => new LocationResponseModel
            {
                LocationId = input.ID,
                CountryId = input.CountryId,
                LocationName = input.LocationName,
                CountryName = input.Country.CountryName
            });
        }

        public async Task<bool> DeleteLocation(long locationId)
        {
            var item = await _itemRepository.GetByIdAsync(locationId);
            if (item == null)
            {
                throw new ApplicationException("Invalid request.");
            }
            item.IsDelete = true;
            await _itemRepository.UpdateAsync(item);
            return true;
        }
    }
}
