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
    public class UserGroupEntityController : ControllerBase
    {
        private readonly IUserGroupEntityService _userGroupEntityService;
        public UserGroupEntityController(IUserGroupEntityService userGroupEntityService)
        {
            _userGroupEntityService = userGroupEntityService;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("SaveUserGroupEntity")]
        public async Task<IActionResult> SaveUserGroupEntity(UserGroupEntityRequestModel model)
        {
            var response = await _userGroupEntityService.SaveUserGroupEntity(model);
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("GetUserGroups")]
        public async Task<IActionResult> GetUserGroups()
        {
            var response = await _userGroupEntityService.GetUserGroups();
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("GetUserGroupEntitys")]
        public async Task<IActionResult> GetUserGroupEntitys()
        {
            var response = await _userGroupEntityService.GetUserGroupEntitys();
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("GetEntities")]
        public async Task<IActionResult> GetEntities()
        {
            var response = await _userGroupEntityService.GetEntities();
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("GetUserGroupEntityById")]
        public async Task<IActionResult> GetUserGroupEntityById(long groupId)
        {
            var response = await _userGroupEntityService.GetUserGroupEntityByGroupId(groupId);
            return Ok(response);
        }
    }
}
