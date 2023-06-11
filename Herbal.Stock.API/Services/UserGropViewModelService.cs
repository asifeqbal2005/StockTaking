using AutoMapper;
using Herbal.Stock.API.Interfaces;
using Herbal.Stock.API.Models;
using Herbalife.Stock.Core.Entities;
using Herbalife.Stock.Core.Interfaces;
using Herbalife.Stock.Core.Specifications;

namespace Herbal.Stock.API.Services
{
    public class UserGropViewModelService : IUserGropViewModelService
    {
        private readonly IAsyncRepository<UserGroup> _itemRepository;        
        private readonly IAsyncRepository<ClaimHandler> _claimHandlerRepository;
        private readonly IMapper _mapper;
        private readonly IAsyncRepository<GroupMaster> _groupMasterRepository;
        private readonly IAsyncRepository<UserGroupPermission> _userGroupPermissionRepository;

        public UserGropViewModelService(IAsyncRepository<UserGroup> itemRepository, 
            IAsyncRepository<ClaimHandler> claimHandlerRepository, 
            IMapper mapper, IAsyncRepository<GroupMaster> groupMasterRepository, IAsyncRepository<UserGroupPermission> userGroupPermissionRepository)
        {
            this._mapper = mapper;
            this._itemRepository = itemRepository;
            this._claimHandlerRepository = claimHandlerRepository;   
            this._groupMasterRepository = groupMasterRepository;
            this._userGroupPermissionRepository = userGroupPermissionRepository;
        }
        public async Task<List<UserGroupResponseModel>> GetAllUserGroup()
        {
            var filterSpecification = new AssignUserGroupFilterSpecifications();
            var item = await _itemRepository.ListAsync(filterSpecification);
            var data = item.GroupBy(g => g.GroupMaster.GroupName).Select(i => new UserGroupResponseModel() { GroupName = i.Key, UserCount = i.Count() }).ToList();
            return data;
        }
        public async Task<List<ClaimHandlerResponseModel>> GetAllClaimHandler(UserGroupResquestModel model)
        {
            List<ClaimHandlerResponseModel> response = new List<ClaimHandlerResponseModel>();
            var claimHandler = await _claimHandlerRepository.ListAllAsync();
            var claimHandlerItem = claimHandler.OrderBy(p => p.UserName).ToList();
            if (!string.IsNullOrEmpty(model.GroupName))
            {
                var userGroup = await GetAssignedUserGroup(model);
                var data = claimHandler.Where(c => !userGroup.Select(u => u.UserId).Contains(c.ID)).ToList().Select(g => new ClaimHandlerResponseModel() { ID = g.ID, UserName = g.UserName, IsSelected = false }).ToList();
                response.AddRange(data);
                var data1 = claimHandler.Where(c => userGroup.Select(u => u.UserId).Contains(c.ID)).ToList().Select(g => new ClaimHandlerResponseModel() { ID = g.ID, UserName = g.UserName, IsSelected = true }).ToList();
                response.AddRange(data1);
                response = response.OrderBy(g => g.UserName).ToList();
                return response;
            }
            else
            {
                return _mapper.Map<List<ClaimHandler>, List<ClaimHandlerResponseModel>>(claimHandlerItem);
            }
        }
        public async Task<List<UserGroupResponseModel>> GetAssignedUserGroup(UserGroupResquestModel model)
        {
            var filterSpecification = new AssignUserGroupFilterSpecifications(model.GroupName);
            var item = await _itemRepository.ListAsync(filterSpecification);
            var data = item.OrderBy(p => p.ID).ToList();
            return _mapper.Map<List<UserGroup>, List<UserGroupResponseModel>>(data);
        }

        public async Task<List<ManageUserResponseModel>> GetClaimHandlers()
        {
            var filterSpecification = new UserGroupSpecification();
            var item = await _itemRepository.ListAsync(filterSpecification);
            var data = item.OrderBy(p => p.ID).ToList();
            return data.Select(p => new ManageUserResponseModel()
            {
                ID = p.ID,
                UserId = p.UserId,
                UserName = p.ClaimHandler.UserName,
                Email = p.ClaimHandler.Email,
                GroupId = p.GroupId,
                GroupName = p.GroupMaster.GroupName,
                IsDelete = p.IsDelete
            }).ToList();
        }

        public async Task<bool> CreateUserGroup(UserGroupResquestModel model)
        {   
            var groupMaster = await _groupMasterRepository.FindByPredicate(p => p.GroupName.ToLower() == model.GroupName.ToLower());
            if (groupMaster == null)
            {
                return false;
            }
            else
            {
                var userGroup = new UserGroup
                {
                    ID = model.ID,
                    UserId = model.UserId,
                    GroupId = groupMaster.FirstOrDefault().ID
                };

                await _itemRepository.AddAsync(userGroup);
                return true;
            }
            
        }

        public async Task<bool> UpdateUserGroup(UserGroupResquestModel model)
        {
            var userGroup = await _itemRepository.FindByPredicate(p => p.ID == model.ID);
            if (userGroup == null) 
            { 
                return false; 
            }
            else
            {                
                var groupMaster = await _groupMasterRepository.FindByPredicate(p => p.GroupName.ToLower() == model.GroupName.ToLower());
                await _itemRepository.UpdateAsync(new UserGroup
                {
                    ID = model.ID,
                    UserId = model.UserId,
                    GroupId = groupMaster[0].ID
                });
                return true;
            }
        }

        public async Task<bool> DeleteUserGroup(UserGroupResquestModel model)
        {
            var filterSpecification = new AssignUserGroupFilterSpecifications(model.GroupName);
            var data = await _itemRepository.ListAsync(filterSpecification);
            var entity = data.Where(g => g.GroupMaster.GroupName.ToLower() == model.GroupName.ToLower()).ToList();

            var permission = await _userGroupPermissionRepository.FindByPredicate(p => p.UserGroup.GroupName.ToLower() == model.GroupName.ToLower());
            
            await _itemRepository.RemoveRangeAsync(entity);
            await _userGroupPermissionRepository.RemoveRangeAsync(permission);            
            await _groupMasterRepository.RemoveRangeAsync(data.Select(k => k.GroupMaster));

            return true;
        }

        
    }
}
