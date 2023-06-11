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
    public class EntityController : ControllerBase
    {
        private readonly IEntityModelService _entityModelService;
        public EntityController(IEntityModelService entityModelService, ILogger<EntityModelService> logger)
        {
            _entityModelService = entityModelService;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("SaveEntity")]
        public async Task<IActionResult> SaveEntity(EntityRequestModel model)
        {
            await _entityModelService.SaveEntity(model);
            return Ok();
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("UpdateEntity")]
        public async Task<IActionResult> UpdateEntity(EntityRequestModel model)
        {
            await _entityModelService.UpdateEntity(model);
            return Ok();
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("GetEntities")]
        public async Task<IActionResult> GetEntities()
        {
            var response = await _entityModelService.GetEntities();
            return Ok(new { data = response });
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("GetParentChildMenu")]
        public async Task<IActionResult> GetParentChildMenu()
        {
            var output = await _entityModelService.GetParentChildMenu();
            return Ok(new { data = output });
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("GetEntityById")]
        public async Task<IActionResult> GetEntityById(long id)
        {
            var response = await _entityModelService.GetEntityById(id);
            return Ok(new { data = response });
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("DeleteEntityById")]
        public async Task<IActionResult> DeleteEntityById(long id)
        {
            await _entityModelService.DeleteEntityById(id);
            return Ok(new { message = "Record deleted successfully." });
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("GetParentEntities")]
        public async Task<IActionResult> GetParentEntities()
        {
            var output = await _entityModelService.GetParentEntities();
            return Ok(new { data = output });
        }
    }
}
