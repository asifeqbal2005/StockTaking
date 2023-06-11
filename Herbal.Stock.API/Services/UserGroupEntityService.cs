using AutoMapper;
using Herbal.Stock.API.Interfaces;
using Herbal.Stock.API.Models;
using Herbalife.Stock.Core.Entities;
using Herbalife.Stock.Core.Interfaces;
using Herbalife.Stock.Core.Specifications;

namespace Herbal.Stock.API.Services
{
    public class UserGroupEntityService : IUserGroupEntityService
    {
        private readonly IAsyncRepository<UserGroupPermission> _itemRepository;
        private readonly IAsyncRepository<EntityMaster> _entityRepository;        
        private readonly IAsyncRepository<GroupMaster> _groupRepository;
        private readonly IMapper _mapper;

        public UserGroupEntityService(IAsyncRepository<GroupMaster> groupRepository,
                                      IAsyncRepository<UserGroupPermission> itemRepository,
                                      IAsyncRepository<EntityMaster> entityRepository,                                      
                                      IMapper mapper)
        {
            _mapper = mapper;
            _itemRepository = itemRepository;
            _entityRepository = entityRepository;            
            _groupRepository = groupRepository;
        }

        public async Task<IEnumerable<CustomDictionary>> GetUserGroups()
        {
            var permissionData = (await _itemRepository.FindByPredicate(k => !k.IsDelete)).Select(l => l.UserGroupId);
            var userGroupData = await _groupRepository.FindByPredicate(k => !permissionData.Contains(k.ID));
            return userGroupData.GroupBy(p => p.ID).Select(k => new CustomDictionary
            {
                ID = k.FirstOrDefault().ID,
                Name = k.FirstOrDefault().GroupName
            });
        }

        public async Task<IEnumerable<UserGroupEntityResponseModel>> GetUserGroupEntitys()
        {
            var specification = new UserGroupEntitySpecification();
            var item = await _itemRepository.ListAsync(specification);            

            return item.GroupBy(k => k.UserGroupId).Select(k => new UserGroupEntityResponseModel
            {
                UserGroupId = k.FirstOrDefault().UserGroupId,
                UserGroupName = k.FirstOrDefault().UserGroup.GroupName,
                EntityName = string.Join(", ", k.Select(p => p.EntityMaster.EntityName)),
                EntityPermission = k.FirstOrDefault().EntityPermission                
            });
        }

        public async Task<IEnumerable<EntityDropdownData>> GetEntities()
        {            
            var suggestion = new EntityMasterSpecification(true, false);
            var entityData = await _entityRepository.ListAsync(suggestion);
            return entityData.Select(k => new EntityDropdownData
            {
                ID = k.ID,
                Name = k.EntityName,
                isCreate = false,
                isDelete = false,
                isRead = false,
                isSelected = false,
                isUpdate = false
            });
        }

        public async Task<IEnumerable<UserGroupPermission>> SaveUserGroupEntity(UserGroupEntityRequestModel model)
        {
            var inputData = model.EntityData.Select(k => new UserGroupPermission
            {
                EntityMasterId = k.ID,
                UserGroupId = model.GroupId,
                EntityPermission = $"{(k.isCreate ? "C" : "")}{(k.isRead ? "|R" : "")}{(k.isUpdate ? "|U" : "")}{(k.isDelete ? "|D" : "")}"
            });
            var item = await _itemRepository.AddRangeAsync(inputData); 
            return item;
        }

        public async Task<UserGroupEntityUpdateResponseModel> GetUserGroupEntityByGroupId(long groupId)
        {
            var specification = new UserGroupEntitySpecification(groupId);
            var item = await _itemRepository.ListAsync(specification);
                        
            return new UserGroupEntityUpdateResponseModel
            {
                GroupID = item.FirstOrDefault().UserGroupId,
                GroupName = item.FirstOrDefault().UserGroup.GroupName,
                EntityData = item.Select(p => new EntityDropdownData
                {
                    ID = p.EntityMasterId,
                    isCreate = p.EntityPermission.Contains("C") ? true : false,
                    isDelete = p.EntityPermission.Contains("D") ? true : false,
                    isRead = p.EntityPermission.Contains("R") ? true : false,
                    isUpdate = p.EntityPermission.Contains("U") ? true : false,
                    isSelected = true,
                    Name = p.EntityMaster.EntityName
                }).ToList(),
            };
        }
    }
}
