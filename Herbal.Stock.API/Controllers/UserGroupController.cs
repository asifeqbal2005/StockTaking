using Herbal.Stock.API.Interfaces;
using Herbal.Stock.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Herbal.Stock.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserGroupController : ControllerBase
    {
        private readonly IUserGropViewModelService _userGropViewModelService;
        public UserGroupController(IUserGropViewModelService userGropViewModelService)
        {
            this._userGropViewModelService = userGropViewModelService;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("getClaimHandlers")]
        public async Task<IActionResult> GetClaimHandlers()
        {
            var response = await _userGropViewModelService.GetClaimHandlers();
            return Ok(new { data = response });            
        }

        [HttpGet]
        [Route("getAllUserGroup")]
        public async Task<IActionResult> GetAllUserGroup()
        {
            var response = await _userGropViewModelService.GetAllUserGroup();
            return Ok(response);
        }

        [HttpPost]
        [Route("getAllClaimHandler")]
        public async Task<IActionResult> GetAllClaimHandler(UserGroupResquestModel model)
        {
            var response = await _userGropViewModelService.GetAllClaimHandler(model);
            return Ok(response);
        }

        [HttpPost]
        [Route("getAssignedUserGroup")]
        public async Task<IActionResult> GetAssignedUserGroup(UserGroupResquestModel model)
        {
            var response = await _userGropViewModelService.GetAssignedUserGroup(model);
            return Ok(response);
        }

        [HttpPost]
        [Route("createUserGroup")]
        public async Task<IActionResult> CreateUserGroup(UserGroupResquestModel model)
        {
            var response = await _userGropViewModelService.CreateUserGroup(model);
            return Ok(response);
        }
        
        [HttpPost]
        [Route("updateUserGroup")]
        public async Task<IActionResult> UpdateUserGroup(UserGroupResquestModel model)
        {
            var response = await _userGropViewModelService.UpdateUserGroup(model);
            return Ok(response);
        }

        [HttpPost]
        [Route("deleteUserGroup")]
        public async Task<IActionResult> DeleteUserGroup(UserGroupResquestModel model)
        {
            var response = await _userGropViewModelService.DeleteUserGroup(model);
            return Ok(response);
        }
    }
}
