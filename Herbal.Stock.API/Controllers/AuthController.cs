using Herbal.Stock.API.Interfaces;
using Herbal.Stock.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Herbal.Stock.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }
        
        [HttpPost]
        [Route("getLoggedInUser")]
        public async Task<IActionResult> GetLoggedInUser(GraphApiToken input)
        {
            var user = await _authService.GetLoggedInUser(input);
            return Ok(user);
        }
    }
}
