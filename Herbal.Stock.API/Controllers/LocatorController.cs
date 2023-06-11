using Herbal.Stock.API.Interfaces;
using Herbal.Stock.API.Models;
using Herbal.Stock.API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Herbal.Stock.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocatorController : ControllerBase
    {
        private readonly ILocatorService _locatorService;
        public LocatorController(ILocatorService locatorService)
        {
            _locatorService = locatorService;
        }

        [HttpPost]
        [Route("insertLocator")]
        public async Task<IActionResult> InsertLocator(LocatorRequestModel model)
        {
            var result = await _locatorService.InsertLocator(model);
            return Ok(result);
        }

        [HttpPost]
        [Route("updateLocator")]
        public async Task<IActionResult> UpdateLocator(LocatorRequestModel model)
        {
            var result = await _locatorService.UpdateLocator(model);
            return Ok(result);
        }

        [HttpGet]
        [Route("getLocators")]
        public async Task<IActionResult> GetLocators()
        {
            var response = await _locatorService.GetLocators();
            return Ok(new { data = response });
        }

        [HttpGet]
        [Route("deleteLocator/{locatorId}")]
        public async Task<IActionResult> DeleteLocator(long locatorId)
        {
            var response = await _locatorService.DeleteLocator(locatorId);
            return Ok(response);
        }
    }
}
