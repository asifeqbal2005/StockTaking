using Herbal.Stock.API.Interfaces;
using Herbal.Stock.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace Herbal.Stock.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StockAllotmentController : ControllerBase
    {
        private readonly IStockAllotmentService _stockAllotmentService;
        public StockAllotmentController(IStockAllotmentService stockAllotmentService)
        {
            _stockAllotmentService = stockAllotmentService;
        }

        [HttpGet]
        [Route("getStockAllotments")]
        public async Task<IActionResult> GetStockAllotments()
        {
            var response = await _stockAllotmentService.GetStockAllotments();
            return Ok(response);
        }

        [HttpGet]
        [Route("getAssignedStockAllotments")]
        public async Task<IActionResult> GetAssignedStockAllotments()
        {
            var response = await _stockAllotmentService.GetAssignedStockAllotments();
            return Ok(response);
        }

        [HttpGet]
        [Route("getUnassignedStockAllotments")]
        public async Task<IActionResult> GetUnassignedStockAllotments()
        {
            var response = await _stockAllotmentService.GetUnassignedStockAllotments();
            return Ok(response);
        }

        [HttpPost]
        [Route("saveStockAllotment")]
        public async Task<IActionResult> SaveStockAllotment(StockAllotmentRequestModel model)
        {
            if (string.IsNullOrEmpty(model.Row) || model.OperatorId1 == 0 || model.OperatorId2 == 0)
            {
                return BadRequest(model);
            }            
            else
            {
                var response = await _stockAllotmentService.SaveStockAllotment(model);
                return Ok(response);
            }            
        }        

        [HttpGet]
        [Route("getOperatorInventoryData/{operatorId}")]
        public async Task<ActionResult> GetOperatorInventoryData(long operatorId)
        {
            var result = await _stockAllotmentService.GetOperatorInventoryData(operatorId);
            return Ok(result);
        }

        [HttpGet]
        [Route("getOperator2InventoryData/{operatorId}")]
        public async Task<ActionResult> GetOperator2InventoryData(long operatorId)
        {
            var result = await _stockAllotmentService.GetOperator2InventoryData(operatorId);
            return Ok(result);
        }

        //[HttpPost]
        //[Route("updateOper1StockRowStart")]
        //public async Task<IActionResult> UpdateOper1StockRowStart(RowRequestModel model)
        //{
        //    if (string.IsNullOrEmpty(model.Row))
        //    {
        //        return BadRequest(model);
        //    }
        //    else
        //    {
        //        var response = await _stockAllotmentService.UpdateOper1StockRowStart(model);
        //        return Ok(response);
        //    }
        //}

        //[HttpGet]
        //[Route("checkOerator1RowInProcess/{operatorId}")]
        //public async Task<ActionResult> CheckOerator1RowInProcess(long operatorId)
        //{
        //    var result = await _stockAllotmentService.CheckOerator1RowInProcess(operatorId);
        //    return Ok(result);
        //}

        [HttpGet]
        [Route("updateOerator1RowComplete/{operatorId}")]
        public async Task<ActionResult> UpdateOerator1RowComplete(long operatorId)
        {
            var result = await _stockAllotmentService.UpdateOerator1RowComplete(operatorId);
            return Ok(result);
        }

        [HttpPost]
        [Route("checkAndUpdateOper1RowInProcess")]
        public async Task<IActionResult> CheckAndUpdateOper1RowInProcess(RowRequestModel model)
        {
            if (string.IsNullOrEmpty(model.Row))
            {
                return BadRequest(model);
            }
            else
            {
                var response = await _stockAllotmentService.CheckAndUpdateOper1RowInProcess(model);
                return Ok(response);
            }
        }

        //[HttpGet]
        //[Route("checkOerator2RowInProcess/{operatorId}")]
        //public async Task<ActionResult> CheckOerator2RowInProcess(long operatorId)
        //{
        //    var result = await _stockAllotmentService.CheckOerator2RowInProcess(operatorId);
        //    return Ok(result);
        //}

        //[HttpPost]
        //[Route("updateOper2StockRowStart")]
        //public async Task<IActionResult> UpdateOper2StockRowStart(RowRequestModel model)
        //{
        //    if (string.IsNullOrEmpty(model.Row))
        //    {
        //        return BadRequest(model);
        //    }
        //    else
        //    {
        //        var response = await _stockAllotmentService.UpdateOper2StockRowStart(model);
        //        return Ok(response);
        //    }
        //}

        [HttpPost]
        [Route("checkAndUpdateOper2RowInProcess")]
        public async Task<IActionResult> CheckAndUpdateOper2RowInProcess(RowRequestModel model)
        {
            if (string.IsNullOrEmpty(model.Row))
            {
                return BadRequest(model);
            }
            else
            {
                var response = await _stockAllotmentService.CheckAndUpdateOper2RowInProcess(model);
                return Ok(response);
            }
        }

        [HttpGet]
        [Route("updateOerator2RowComplete/{operatorId}")]
        public async Task<ActionResult> UpdateOerator2RowComplete(long operatorId)
        {
            var result = await _stockAllotmentService.UpdateOerator2RowComplete(operatorId);
            return Ok(result);
        }        

        [HttpGet]
        [Route("getOperator1StockAllotments/{operatorId}")]
        public async Task<IActionResult> GetOperator1StockAllotments(long operatorId)
        {
            var response = await _stockAllotmentService.GetOperator1StockAllotments(operatorId);
            return Ok(response);
        }

        [HttpGet]
        [Route("getOperator2StockAllotments/{operatorId}")]
        public async Task<IActionResult> GetOperator2StockAllotments(long operatorId)
        {
            var response = await _stockAllotmentService.GetOperator2StockAllotments(operatorId);
            return Ok(response);
        }

        [HttpGet]
        [Route("getSupervisorSubmitStockRow")]
        public async Task<ActionResult> GetSupervisorSubmitStockRow()
        {
            var result = await _stockAllotmentService.GetSupervisorSubmitStockRow();
            return Ok(result);
        }

        [HttpPost]
        [Route("submitStockRowBySupervisor")]
        public async Task<IActionResult> SubmitStockRowBySupervisor(RowRequestModel model)
        {
            if (string.IsNullOrEmpty(model.Row))
            {
                return BadRequest(model);
            }
            else
            {
                var response = await _stockAllotmentService.SubmitStockRowBySupervisor(model);
                return Ok(response);
            }
        }
        
        [HttpGet]
        [Route("getManagerSubmitStockRow")]
        public async Task<ActionResult> GetManagerSubmitStockRow()
        {
            var result = await _stockAllotmentService.GetManagerSubmitStockRow();
            return Ok(result);
        }

        [HttpPost]
        [Route("submitStockRowByManager")]
        public async Task<IActionResult> SubmitStockRowByManager(RowRequestModel model)
        {
            if (string.IsNullOrEmpty(model.Row))
            {
                return BadRequest(model);
            }
            else
            {
                var response = await _stockAllotmentService.SubmitStockRowByManager(model);
                return Ok(response);
            }
        }
    }
}
