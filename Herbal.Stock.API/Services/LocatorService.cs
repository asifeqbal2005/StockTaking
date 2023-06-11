using AutoMapper;
using Herbal.Stock.API.Interfaces;
using Herbal.Stock.API.Models;
using Herbalife.Stock.Core.Entities;
using Herbalife.Stock.Core.Interfaces;
using Herbalife.Stock.Core.Specifications;
using Microsoft.Graph;

namespace Herbal.Stock.API.Services
{
    public class LocatorService : ILocatorService
    {
        private readonly IAsyncRepository<Locator> _itemRepository;
        private readonly IMapper _mapper;
        public LocatorService(IAsyncRepository<Locator> itemRepository, IMapper mapper) 
        { 
            _itemRepository = itemRepository;
            _mapper = mapper;
        }
        
        public async Task<IEnumerable<LocatorResponseModel>> GetLocators()
        {
            var filterSpecification = new LocatorFilterSpecification();
            var items = await _itemRepository.ListAsync(filterSpecification);
            var data = items.OrderBy(p => p.ID).ToList();
            return data.Select(input => new LocatorResponseModel
            {
                LocatorId = input.ID,
                LocationId = input.LocationId,
                LocatorName = input.LocatorName,
                LocationName = input.Location.LocationName
            });
        }

        public async Task<bool> InsertLocator(LocatorRequestModel model)
        {
            bool result = false;
            var locatorRequest = _mapper.Map<Locator>(model);
            var item = await _itemRepository.AddAsync(locatorRequest);
            if (item != null)
            {
                result = true;
            }
            return result;
        }

        public async Task<bool> UpdateLocator(LocatorRequestModel model)
        {
            var locatorRequest = _mapper.Map<Locator>(model);
            await _itemRepository.UpdateAsync(locatorRequest);
            return true;
        }

        public async Task<bool> DeleteLocator(long locatorId)
        {
            var item = await _itemRepository.GetByIdAsync(locatorId);
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
