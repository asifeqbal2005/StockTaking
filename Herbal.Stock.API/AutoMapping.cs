using AutoMapper;
using Herbal.Stock.API.Models;
using Herbalife.Stock.Core.Entities;

namespace Herbal.Stock.API
{
    public class AutoMapping : Profile
    {
        public AutoMapping()
        {
            //Do Mapping
            CreateMap<ApplicationUserModel, ClaimHandler>()
                .ForPath(src => src.ID, opt => opt.MapFrom(dst => dst.UserID))
                .ForPath(src => src.CountryId, opt => opt.MapFrom(dst => dst.Country))
                .ForPath(src => src.LocationId, opt => opt.MapFrom(dst => dst.Location))
                .ForPath(src => src.LocatorId, opt => opt.MapFrom(dst => dst.Locator));
            
            CreateMap<ClaimHandler, ClaimHandlerResponseModel>();            
            CreateMap<EntityMaster, EntityResponseModel>();
            CreateMap<EntityRequestModel, EntityMaster>();
            CreateMap<Country, CountryResponseModel>();
            CreateMap<CountryRequestModel, Country>();
            CreateMap<UserGroup, ManageUserResponseModel>();

            CreateMap<LocationRequestModel, Location>();
            CreateMap<LocatorRequestModel, Locator>();

            CreateMap<InventoryRequestModel, WMSInventory>().ForPath(src=>src.ID, opt=>opt.MapFrom(dst=>dst.WMSInventoryID));

        }
    }
}
