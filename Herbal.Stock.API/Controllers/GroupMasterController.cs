using Herbal.Stock.API.Interfaces;
using Herbal.Stock.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Herbal.Stock.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupMasterController : ControllerBase
    {
        private readonly IGroupMasterService _groupMasterService;

        public GroupMasterController(IGroupMasterService groupMasterService)
        {
            _groupMasterService = groupMasterService;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("getGroupList")]
        public async Task<IActionResult> GetUserGroupList()
        {
            var response = await _groupMasterService.GetUserGroupList();
            return Ok(new { data = response });
        }

    }
}
