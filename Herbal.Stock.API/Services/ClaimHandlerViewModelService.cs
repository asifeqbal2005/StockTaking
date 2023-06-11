using AutoMapper;
using Azure;
using Herbal.Stock.API.Enums;
using Herbal.Stock.API.Interfaces;
using Herbal.Stock.API.Models;
using Herbalife.Stock.Core.Entities;
using Herbalife.Stock.Core.Interfaces;
using Herbalife.Stock.Core.Specifications;
using Herbalife.Stock.Infrastructure.Factory;
using Microsoft.AspNetCore.Http;
using Microsoft.Graph;

namespace Herbal.Stock.API.Services
{
    public class ClaimHandlerViewModelService : IClaimHandlerViewModelService
    {
        private readonly IAsyncRepository<ClaimHandler> _itemRepository;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;
        private readonly IAzureTokenConfiguration _azureConfig;

        public ClaimHandlerViewModelService(IAsyncRepository<ClaimHandler> itemRepository,
                                                    IMapper mapper,
                                                    IConfiguration config,
                                                     IAzureTokenConfiguration azureConfig
                                                  )
        {
            _mapper = mapper;
            _config = config;
            _itemRepository = itemRepository;
            _azureConfig = azureConfig;
        }

        public async Task<IEnumerable<ClaimHandlerResponseModel>> GetClaimHandlersAsync()
        {            
            var filterSpecification = new ClaimHandlerSpecification(false);
            var items = await _itemRepository.ListAsync(filterSpecification);
            var response = items.Select(r => _mapper.Map<ClaimHandlerResponseModel>(r));
            return response;
        }

        public async Task<IEnumerable<ClaimHandlerResponseModel>> GetClaimHandlers(long organisationId, bool IncludeInActive = false)
        {
            IEnumerable<ClaimHandlerResponseModel> response = null;
            var filterSpecification = new ClaimHandlerSpecification(organisationId);
            var items = await _itemRepository.ListAsync(filterSpecification);
            if (IncludeInActive)
            {
                response = items.Select(r => _mapper.Map<ClaimHandlerResponseModel>(r));
            }
            else
            {
                response = items.Where(m => !m.IsDelete).Select(r => _mapper.Map<ClaimHandlerResponseModel>(r));
            }
            return response;
        }
        public async Task<ClaimHandlerResponseModel> GetClaimHandler(long claimHandlerId)
        {            
            var item = await _itemRepository.GetByIdAsync(claimHandlerId);
            var response = _mapper.Map<ClaimHandlerResponseModel>(item);
            return response;
        }

        public async Task<ClaimHandlerResponseModel> AddClaimHandlers(ClaimHandlerRequestModel claimHandlerRequestModel)
        {
            var claimHandler = _mapper.Map<ClaimHandler>(claimHandlerRequestModel);
            var emailExistInDB = await CheckEmailAlreadyExistInDB(claimHandler.ID, claimHandler.Email);

            if (!emailExistInDB)
            {
                bool IsUserExistInAD = await CheckUserExistInAD(claimHandler.UserName, claimHandler.Email);
                if (IsUserExistInAD)
                {
                    //Add user in DB and send invitaion mail manually
                    var item = await _itemRepository.AddAsync(claimHandler);
                    claimHandlerRequestModel.ID = item.ID;
                }
                else
                {
                    throw new ApplicationException("User does not exist in system");
                }

                var response = await GetClaimHandler(claimHandlerRequestModel.ID.Value);
                return response;
            }
            else
            {
                throw new Exception(StatusCode.Duplicate.ToString());
            }
        }

        public async Task<long?> GetAutoClaimsHandlerId(long handlingOrganizationId)
        {
            return null;
        }
        
        public async Task<ClaimHandlerResponseModel> PutClaimHandlers(ClaimHandlerRequestModel claimHandlerRequestModel)
        {
            var claimHandler = _mapper.Map<ClaimHandler>(claimHandlerRequestModel);

            var ExistingHandlerData = await _itemRepository.GetByIdAsync(claimHandler.ID);
            _itemRepository.DetachEntity(ExistingHandlerData);
            await _itemRepository.UpdateAsync(claimHandler);
            var response = await GetClaimHandler(claimHandlerRequestModel.ID.Value);
            return response;
        }

        private async Task<bool> CheckEmailAlreadyExistInDB(long? ID, string EmailId)
        {
            bool emailAlreadyExist = true;
            if (ID.HasValue)
            {
                var item = await _itemRepository.FindByPredicate(c => c.Email == EmailId && c.ID != ID.Value);
                if (item.Count == 0)
                {
                    emailAlreadyExist = false;
                }
            }
            else
            {
                var item = await _itemRepository.FindByPredicate(c => c.Email == EmailId);
                if (item.Count == 0)
                {
                    emailAlreadyExist = false;
                }
            }

            return emailAlreadyExist;
        }

        private async Task<bool> CheckUserExistInAD(string UserFullName, string EmailId)
        {
            bool userExist = false;
            List<Microsoft.Graph.User> GraphUsers = new List<Microsoft.Graph.User>();
            Users users = new Users();
            users.resources = new List<Models.User>();

            // Initialize the GraphServiceClient.
            var access_token = _azureConfig.getGraphAccessToken();
            var client = MicrosoftGraphClient.GetAuthProviders(access_token);
            IGraphServiceUsersCollectionPage usersPage = await client.Users.Request().GetAsync();
            GraphUsers.AddRange(usersPage.CurrentPage);

            while (usersPage.NextPageRequest != null)
            {
                usersPage = await usersPage.NextPageRequest.GetAsync();
                GraphUsers.AddRange(usersPage.CurrentPage);
            }

            // Copy Microsoft User to DTO User
            foreach (var user in GraphUsers)
            {
                var objUser = CopyHandler.UserProperty(user);
                users.resources.Add(objUser);
            }
            users.totalResults = users.resources.Count;
            userExist = users.resources.Any(c => c.email == EmailId);
            return userExist;
        }
    }
}
