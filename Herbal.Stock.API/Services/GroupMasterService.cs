using AutoMapper;
using Herbal.Stock.API.Interfaces;
using Herbal.Stock.API.Models;
using Herbalife.Stock.Core.Entities;
using Herbalife.Stock.Core.Interfaces;
using Herbalife.Stock.Core.Specifications;

namespace Herbal.Stock.API.Services
{
    public class GroupMasterService : IGroupMasterService
    {
        private readonly IAsyncRepository<GroupMaster> _itemRepository;
        private readonly IMapper _mapper;

        public GroupMasterService(IAsyncRepository<GroupMaster> itemRepository, IMapper mapper)
        {
            _itemRepository = itemRepository;
            _mapper = mapper;
        }

        public async Task<List<GroupMasterResponseModel>> GetUserGroupList()
        {
            var filterSpecification = new GroupMasterSpecification();
            var item = await _itemRepository.ListAsync(filterSpecification);
            var data = item.OrderBy(p => p.GroupName).ToList();
            return data.Select(p => new GroupMasterResponseModel()
            {
                GroupId = p.ID,
                GroupName = p.GroupName,
                IsDelete = p.IsDelete
            }).ToList();
        }
    }
}
