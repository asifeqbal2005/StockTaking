using Herbal.Stock.API.Enums;
using Herbal.Stock.API.Interfaces;
using Herbal.Stock.API.Models;
using Herbalife.Stock.Core.Entities;
using Herbalife.Stock.Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Herbal.Stock.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly ILogger<AuthService> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IIdentityService _identityService;

        public AuthService(IHttpContextAccessor httpContextAccessor, ILoggerFactory loggerFactory, IIdentityService identityService) 
        {
            _httpContextAccessor = httpContextAccessor;
            _logger = loggerFactory.CreateLogger<AuthService>();
            _identityService = identityService;
        }

        public async Task<ApplicationUserModel?> GetLoggedInUser(GraphApiToken input)
        {
            var loggedInUserDetails = new ApplicationUserModel();
            try
            {
                var userEmail = _httpContextAccessor.HttpContext.User.FindFirst("upn").Value;
                var handler = await _identityService.GetLoggedInUser();
                if (handler == null)
                {
                    var graphClient = MicrosoftGraphClient.GetAuthProviders(input.AccessToken);
                    var graphResult = await graphClient.Me.Request().GetAsync();
                    if (graphResult != null && graphResult != null)
                    {
                        ClaimHandler cl = new ClaimHandler
                        {
                            UserName = graphResult.DisplayName,
                            Email = graphResult.UserPrincipalName,
                            IsAdmin = false
                        };
                        handler = await _identityService.AddUser(cl);
                    }
                    else
                    {
                        return null;
                    }                        
                }

                loggedInUserDetails = new ApplicationUserModel()
                {
                    UserID = handler.ID,
                    UserName = handler.UserName,
                    Email = handler.Email,
                    Country = handler.CountryId,
                    Location = handler.LocationId,
                    Locator = handler.LocatorId,                    
                    IsAdmin = handler.IsAdmin,
                    OrganisationId = handler.OrganisationId,
                };

                var userRole = _identityService.GetCurrentUserRole();
                if (userRole != null && userRole.Count > 0 && userRole.FirstOrDefault(p => p == $"Auth.{RoleType.Admin.ToString()}") != null)
                {
                    List<EntityMaster> userPermissions = (await _identityService.GetUserAdminGroupPermissions()).Distinct().ToList();
                    loggedInUserDetails.UserPermission = userPermissions.Select(k => new ApplicationPermissionModel
                    {
                        EntityID = k.ID,
                        EntityName = k.EntityName,
                        Permission = "C|R|U|D"
                    }).ToList();
                }
                else
                {
                    var userPermissions = (await _identityService.GetUserGroupPermissions(handler.ID));
                    loggedInUserDetails.UserPermission = userPermissions.Select(k => new ApplicationPermissionModel
                    {
                        EntityID = k.ID,
                        EntityName = k.EntityMaster.EntityName,
                        Permission = k.EntityPermission
                    }).ToList();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Error in GetLoggedInUser method ", ex);
            }
            return loggedInUserDetails;
        }
    }
}
