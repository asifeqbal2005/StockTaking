using Herbal.Stock.API.Models;

namespace Herbal.Stock.API.Interfaces
{
    public interface IStockAllotmentService
    {
        Task<List<StockAllotmentResponseModel>> GetStockAllotments();
        Task<List<StockAllotmentResponseModel>> GetAssignedStockAllotments();
        Task<List<StockAllotmentResponseModel>> GetUnassignedStockAllotments();
        Task<bool> SaveStockAllotment(StockAllotmentRequestModel model);       
        Task<List<OperatorInventoryResponse>> GetOperatorInventoryData(long operatorId);
        Task<List<OperatorInventoryResponse>> GetOperator2InventoryData(long operatorId);
        //Task<bool> UpdateOper1StockRowStart(RowRequestModel model);
        //Task<bool> CheckOerator1RowInProcess(long operatorId);
        Task<bool> UpdateOerator1RowComplete(long operatorId);
        Task<bool> CheckAndUpdateOper1RowInProcess(RowRequestModel model);
       // Task<bool> CheckOerator2RowInProcess(long operatorId);
       // Task<bool> UpdateOper2StockRowStart(RowRequestModel model);
        Task<bool> CheckAndUpdateOper2RowInProcess(RowRequestModel model);
        Task<bool> UpdateOerator2RowComplete(long operatorId);        
        Task<List<string?>> GetOperator1StockAllotments(long operatorId);
        Task<List<string?>> GetOperator2StockAllotments(long operatorId);
        Task<List<string?>> GetSupervisorSubmitStockRow();
        Task<bool> SubmitStockRowBySupervisor(RowRequestModel model);

        Task<List<string?>> GetManagerSubmitStockRow();
        Task<bool> SubmitStockRowByManager(RowRequestModel model);
    }
}
