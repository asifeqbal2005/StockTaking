using Herbal.Stock.API.Interfaces;
using Herbal.Stock.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace Herbal.Stock.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InventoryController : ControllerBase
    {
        private readonly IFileService _fileService;
        public InventoryController(IFileService fileService)
        {
            _fileService = fileService;
        }

        [HttpGet]
        [Route("bindInventoryDetails")]
        public async Task<ActionResult> BindInventoryDetails()
        {
            var result = await _fileService.GetInventoryDetails();
            return Ok(result);
        }

        [HttpPost("uploadInventoryFile")]        
        public async Task<ActionResult> UploadInventoryFile(IFormFile fileDetails)
        {
            if (fileDetails == null)
            {
                return BadRequest();
            }

            var result = await _fileService.UploadWMSInventoryAsync(fileDetails);
            return Ok(result);
        }

        [HttpGet]
        [Route("getRowDataToFilter")]
        public async Task<ActionResult> GetRowDataToFilter()
        {
            var result = await _fileService.GetRowDataToFilter();
            return Ok(result);
        }

        [HttpGet]
        [Route("getSupervisorInventory")]
        public async Task<ActionResult> GetSupervisorInventory()
        {
            var result = await _fileService.GetSupervisorInventoryData();
            return Ok(result);
        }

        [HttpPut]
        [Route("UpdateInventory")]
        public async Task<IActionResult> UpdateInventory(UpdateInventoryModel model)
        {
            var result = await _fileService.UpdateInventoryData(model);
            return Ok(result);
        }

        [HttpGet]
        [Route("getStockOnHandInventory")]
        public async Task<ActionResult> GetStockOnHandInventory()
        {
            var result = await _fileService.GetStockOnHandInventory();
            return Ok(result);
        }

        [HttpPost("uploadOracleInventoryFile")]
        public async Task<ActionResult> UploadOracleInventoryFile(IFormFile fileDetails)
        {
            if (fileDetails == null)
            {
                return BadRequest();
            }

            var result = await _fileService.UploadOracleInventoryAsync(fileDetails);
            return Ok(result);
        }

        [HttpGet]
        [Route("compareStockOnHandInventory")]
        public async Task<ActionResult> CompareStockOnHandInventory(IFormFile fileDetails)
        {
            var result = await _fileService.UploadOracleInventoryAsync(fileDetails);
            return Ok(result);
        }

    }
}
