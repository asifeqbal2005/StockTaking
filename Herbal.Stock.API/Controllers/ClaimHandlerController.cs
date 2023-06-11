using Herbal.Stock.API.Interfaces;
using Herbal.Stock.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Herbal.Stock.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClaimHandlerController : ControllerBase
    {
        private readonly IClaimHandlerViewModelService _claimHandlerViewModelService;

        public ClaimHandlerController(IClaimHandlerViewModelService claimHandlerViewModelService)
        {
            _claimHandlerViewModelService = claimHandlerViewModelService;
        }

        [HttpGet]
        [Route("getAllClaimHandlers")]
        public async Task<IEnumerable<ClaimHandlerResponseModel>> GetClaimHandlersAsync()
        {
            var response = await _claimHandlerViewModelService.GetClaimHandlersAsync();
            return response;
        }

        [HttpGet]
        public async Task<IEnumerable<ClaimHandlerResponseModel>> GetAsync(long organisationId)
        {
            var claimHandlerResponseModel = await _claimHandlerViewModelService.GetClaimHandlers(organisationId);
            return claimHandlerResponseModel;
        }

        [HttpGet]
        [Route("getClaimHandlerByOrganisationId")]
        public async Task<IEnumerable<ClaimHandlerResponseModel>> GetAsync(long organisationId, bool IncludeInActive)
        {
            var claimHandlerResponseModel = await _claimHandlerViewModelService.GetClaimHandlers(organisationId, IncludeInActive);
            return claimHandlerResponseModel;

        }

        [HttpGet]
        [Route("getClaimHandlerById")]
        public async Task<ClaimHandlerResponseModel> GetClaimHandler(long claimHandlerId)
        {
            var claimHandlerResponseModel = await _claimHandlerViewModelService.GetClaimHandler(claimHandlerId);
            return claimHandlerResponseModel;
        }

        [HttpPost]
        [Route("createClaimHandler")]
        public async Task<IActionResult> PostClaimHandlers(ClaimHandlerRequestModel claimHandlerRequest)
        {
            var response = await _claimHandlerViewModelService.AddClaimHandlers(claimHandlerRequest);
            return Ok(response);
        }

        [HttpPut]
        [Route("updateClaimHandler")]
        public async Task<IActionResult> PutClaimHandlers(ClaimHandlerRequestModel claimHandlerRequest)
        {
            var response = await _claimHandlerViewModelService.PutClaimHandlers(claimHandlerRequest);
            return Ok(response);
        }

    }
}
