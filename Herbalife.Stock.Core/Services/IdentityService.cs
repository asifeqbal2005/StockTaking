using Herbalife.Stock.Core.Entities;
using Herbalife.Stock.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Herbalife.Stock.Core.Specifications;

namespace Herbalife.Stock.Core.Services
{
    public class IdentityService : IIdentityService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IAsyncRepository<ClaimHandler> _claimHandlerRepository;
        private readonly IAsyncRepository<EntityMaster> _entityMasterRepository;
        private readonly IAsyncRepository<UserGroup> _userGroupRepository;
        private readonly IAsyncRepository<UserGroupPermission> _userGroupPermissionRepository;
        public IdentityService(IHttpContextAccessor httpContextAccessor, 
            IAsyncRepository<ClaimHandler> claimHandlerRepository, 
            IAsyncRepository<EntityMaster> entityMasterRepository, 
            IAsyncRepository<UserGroup> userGroupRepository, 
            IAsyncRepository<UserGroupPermission> userGroupPermissionRepository) 
        {
            _httpContextAccessor = httpContextAccessor;
            _claimHandlerRepository = claimHandlerRepository;
            _entityMasterRepository = entityMasterRepository;
            _userGroupRepository = userGroupRepository;
            _userGroupPermissionRepository = userGroupPermissionRepository;
        }
        public async Task<ClaimHandler> AddUser(ClaimHandler cl)
        {
            var items = await _claimHandlerRepository.AddAsync(cl);
            return items;
        }

        public IList<string> GetCurrentUserRole()
        {
            return _httpContextAccessor.HttpContext.User.FindAll("roles").Select(k => k.Value).ToList();
        }

        public async Task<ClaimHandler> GetLoggedInUser()
        {
            var userEmail = _httpContextAccessor.HttpContext.User.FindFirst("upn").Value;
            var filterSpecification = new ClaimHandlerFilterSpecification(string.Empty, userEmail);
            var items = await _claimHandlerRepository.ListAsync(filterSpecification);
            return items.FirstOrDefault();
        }

        public async Task<List<EntityMaster>> GetUserAdminGroupPermissions()
        {
            var groupItems = await _entityMasterRepository.ListAllAsync();
            return groupItems.ToList();
        }

        public async Task<List<UserGroupPermission>> GetUserGroupPermissions(long userId)
        {
            var filterSpecification = new AssignUserGroupFilterSpecifications(userId);
            var items = await _userGroupRepository.ListAsync(filterSpecification);

            var specification = new UserGroupPermissionSpecification(items.Select(k => k.GroupId).ToList());
            var groupItems = await _userGroupPermissionRepository.ListAsync(specification);
            return groupItems.ToList();
        }
    }
}
