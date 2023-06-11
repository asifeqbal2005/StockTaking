using AutoMapper;
using Herbal.Stock.API.Enums;
using Herbal.Stock.API.Interfaces;
using Herbal.Stock.API.Models;
using Herbalife.Stock.Core.Entities;
using Herbalife.Stock.Core.Interfaces;
using Herbalife.Stock.Core.Specifications;

namespace Herbal.Stock.API.Services
{
    public class EntityModelService : IEntityModelService
    {
        private readonly IAsyncRepository<EntityMaster> _itemRepository;
        private readonly IIdentityService _identityService;
        private readonly IMapper _mapper;

        public EntityModelService(IAsyncRepository<EntityMaster> itemRepository,                                   
                                  IIdentityService identityService,                                    
                                  IMapper mapper)
        {
            _mapper = mapper;
            _itemRepository = itemRepository;
            _identityService = identityService;            
        }

        public async Task<IEnumerable<EntityResponseModel>> GetEntities()
        {
            var filterSpecification = new EntityMasterSpecification();
            var items = await _itemRepository.ListAsync(filterSpecification);            
            
            var data = items.OrderBy(p => p.ID).ToList();
            return data.OrderBy(p => p.DisplayOrder).Select(input => new EntityResponseModel
            {
                ID = input.ID,
                Description = input.Description,
                EntityName = input.EntityName,
                RouterLink = input.RouterLink,
                IsParent = input.IsParent ?? false,
                DisplayOrder = input.DisplayOrder,
                EntityIcon = input.EntityIcon,
                ParentName = items.FirstOrDefault(k => k.ID == input.ParentId) == null ? "N/A" : items.FirstOrDefault(k => k.ID == input.ParentId).EntityName
            });
        }

        public async Task<IEnumerable<EntityParentChildResponseModel>> GetParentChildMenu()
        {
            var userData = await _identityService.GetLoggedInUser();
            var userRole = _identityService.GetCurrentUserRole();
            List<EntityMaster> userPermissions = null;
            
            if (userRole != null && userRole.Count > 0 && userRole.FirstOrDefault(p => p == $"Auth.{RoleType.Admin.ToString()}") != null)
            {
                userPermissions = (await _identityService.GetUserAdminGroupPermissions()).Distinct().ToList();
            }
            else
            {
                userPermissions = (await _identityService.GetUserGroupPermissions(userData.ID)).Select(s => s.EntityMaster).Distinct().ToList();
            }

            var entityData = userPermissions.Where(k => k.IsParent != true && k.IsDelete == false);
            var menu = entityData.Select(async k => await getChildMenu(k, userPermissions)).Select(t => t.Result).OrderBy(o => o.DisplayOrder).ToList();
            //var allMultilingualItem = await _multilingualViewModelService.GetAllMultilingualItem(model);
            var menus = (from m in menu
                                    //join a in allMultilingualItem on m.EntityName equals a.LabelName
                                    select new EntityParentChildResponseModel()
                                    {
                                        ChildMenu = m.ChildMenu.OrderBy(p => p.DisplayOrder),
                                        Description = m.Description,
                                        DisplayOrder = m.DisplayOrder,
                                        EntityIcon = m.EntityIcon,
                                        EntityName = m.EntityName,
                                        IsParent = m.IsParent,
                                        //LabelId = a.LabelId,
                                        //LabelName = a.LabelName,
                                        //TranslatedText = a.TranslatedText,
                                        RouterLink = m.RouterLink
                                    }).ToList();
            return menus;
        }

        private async Task<EntityParentChildResponseModel> getChildMenu(EntityMaster input, IEnumerable<EntityMaster> items)
        {
            var entityData = items.Where(k => k.ParentId == input.ID && k.IsDelete == false).ToList();
            //var allMultilingualItem = await _multilingualViewModelService.GetAllMultilingualItem(model);
            var formattedmenuItem = (from m in entityData
                                    //join a in allMultilingualItem on m.EntityName.Trim().Replace(" ", "") equals a.LabelName.Trim().Replace(" ", "")
                                    select new EntityParentChildResponseModel()
                                    {
                                        Description = m.Description,
                                        DisplayOrder = m.DisplayOrder,
                                        EntityIcon = m.EntityIcon,
                                        EntityName = m.EntityName,
                                        //LabelId = m.LabelId,
                                        //LabelName = a.LabelName,
                                        //TranslatedText = a.TranslatedText,
                                        IsParent = m.IsParent ?? false,
                                        RouterLink = m.RouterLink
                                    }).ToList();

            var response = new EntityParentChildResponseModel
            {
                Description = input.Description,
                EntityName = input.EntityName,
                RouterLink = input.RouterLink,
                IsParent = input.IsParent ?? false,
                DisplayOrder = input.DisplayOrder,
                EntityIcon = input.EntityIcon,

                ChildMenu = formattedmenuItem.Select(k => new EntityParentChildResponseModel
                {
                    Description = k.Description,
                    EntityName = k.EntityName,
                    RouterLink = k.RouterLink,
                    IsParent = k.IsParent,
                    DisplayOrder = k.DisplayOrder,
                    EntityIcon = input.EntityIcon,
                    ChildMenu = null,
                    //TranslatedText = k.TranslatedText
                }).OrderBy(o => o.DisplayOrder)
            };

            return await Task.FromResult(response);
        }
        public async Task<EntityResponseModel> GetEntityById(long id)
        {
            var filterSpecification = new EntityMasterSpecification(id);
            var input = await _itemRepository.ListAsync(filterSpecification);

            return new EntityResponseModel
            {
                ID = input.FirstOrDefault()?.ID,
                Description = input.FirstOrDefault().Description,
                EntityName = input.FirstOrDefault().EntityName,
                RouterLink = input.FirstOrDefault().RouterLink,
                IsParent = input.FirstOrDefault().IsParent ?? false,
                DisplayOrder = input.FirstOrDefault().DisplayOrder,
                EntityIcon = input.FirstOrDefault().EntityIcon,                
                ParentId = input.FirstOrDefault().ParentId,
                AssignPermission = input.FirstOrDefault().AssignPermission
            };
        }

        public async Task<bool> SaveEntity(EntityRequestModel model)
        {
            var emailExistInDB = await _itemRepository.FindByPredicate(c => c.EntityName == model.EntityName && c.IsDelete == false);
            if (emailExistInDB != null && emailExistInDB.Any())
            {
                throw new Exception(StatusCode.Duplicate.ToString());
            }

            var entityRequest = _mapper.Map<EntityMaster>(model);            
            var item = await _itemRepository.AddAsync(entityRequest);
            return true;
        }

        public async Task<bool> UpdateEntity(EntityRequestModel model)
        {
            var emailExistInDB = await _itemRepository.FindByPredicate(c => c.EntityName == model.EntityName && c.IsDelete == false);
            if (emailExistInDB != null && emailExistInDB.Any() && emailExistInDB.FirstOrDefault(k => k.ID != model.ID) != null)
            {
                throw new Exception(StatusCode.Duplicate.ToString());
            }

            var entityRequest = _mapper.Map<EntityMaster>(model);            
            await _itemRepository.UpdateAsync(entityRequest);
            return true;
        }

        public async Task DeleteEntityById(long id)
        {
            var item = await _itemRepository.GetByIdAsync(id);
            if (item == null)
            {
                throw new ApplicationException("Invalid request.");
            }                

            item.IsDelete = true;
            await _itemRepository.UpdateAsync(item);            
        }

        public async Task<IEnumerable<CustomDictionary>> GetParentEntities()
        {
            return (await _itemRepository.FindByPredicate(k => k.IsParent == false && k.IsDelete == false)).Select(p => new CustomDictionary
            {
                ID = p.ID,
                Name = p.EntityName
            });
        }
    }
}
