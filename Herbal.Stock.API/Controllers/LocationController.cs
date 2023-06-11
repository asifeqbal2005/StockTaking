using Herbal.Stock.API.Interfaces;
using Herbal.Stock.API.Models;
using Herbal.Stock.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Herbal.Stock.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationController : ControllerBase
    {
        private readonly ILocationService _locationService;
        public LocationController(ILocationService locationService) 
        {
            _locationService = locationService;
        }

        
        [HttpPost]
        [Route("insertLocation")]
        public async Task<IActionResult> InsertLocation(LocationRequestModel model)
        {
            var result = await _locationService.InsertLocation(model);
            return Ok(result);
        }

        [HttpPost]
        [Route("updateLocation")]
        public async Task<IActionResult> UpdateLocation(LocationRequestModel model)
        {
            var result = await _locationService.UpdateLocation(model);
            return Ok(result);
        }

        [HttpGet]
        [Route("getLocations")]
        public async Task<IActionResult> GetLocations()
        {
            var response = await _locationService.GetLocations();
            return Ok(new { data = response });
        }

        [HttpGet]
        [Route("deleteLocation/{locationId}")]
        public async Task<IActionResult> DeleteLocation(long locationId)
        {
            var response = await _locationService.DeleteLocation(locationId);
            return Ok(response);
        }
    }
}
