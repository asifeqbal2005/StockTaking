using Herbal.Stock.API.Interfaces;
using Herbal.Stock.API.Models;
using Herbal.Stock.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Herbal.Stock.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CountryController : ControllerBase
    {
        private readonly ICountryService _countryService;
        public CountryController(ICountryService countryService, ILogger<CountryService> logger)
        {
            _countryService = countryService;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("GetCountries")]
        public async Task<IActionResult> GetCountries()
        {
            var response = await _countryService.GetCountries();
            return Ok(new { data = response });
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("GetCountryById")]
        public async Task<IActionResult> GetCountryById(long id)
        {
            var response = await _countryService.GetCountryById(id);
            return Ok(new { data = response });
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("AddCountry")]
        public async Task<IActionResult> AddCountry(CountryRequestModel model)
        {
            string result = await _countryService.AddCountry(model);
            return Ok(result);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("UpdateCountry")]
        public async Task<IActionResult> UpdateCountry(CountryRequestModel model)
        {
            string result = await _countryService.UpdateCountry(model);
            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("deleteCountry/{id}")]
        public async Task<IActionResult> DeleteCountry(long id)
        {
            bool result = await _countryService.DeleteCountry(id);
            //return Ok(new { message = "Record deleted successfully." });
            return Ok(result);
        }
    }
}
