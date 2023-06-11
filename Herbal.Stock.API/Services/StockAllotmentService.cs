using Herbal.Stock.API.Interfaces;
using Herbal.Stock.API.Models;
using Herbalife.Stock.Core.Entities;
using Herbalife.Stock.Core.Interfaces;
using Herbalife.Stock.Core.Specifications;

namespace Herbal.Stock.API.Services
{
    public class StockAllotmentService : IStockAllotmentService
    {
        private readonly IAsyncRepository<StockAllotment> _itemRepository;
        private readonly IAsyncRepository<WMSInventory> _inventoryRepository;
        private readonly IAsyncRepository<ClaimHandler> _claimHandlerRepository;
        public StockAllotmentService(IAsyncRepository<StockAllotment> itemRepository, 
            IAsyncRepository<WMSInventory> inventoryRepository, 
            IAsyncRepository<ClaimHandler> claimHandlerRepository)
        {
            _itemRepository = itemRepository;
            _inventoryRepository = inventoryRepository;
            _claimHandlerRepository = claimHandlerRepository;   
        }

        public async Task<List<StockAllotmentResponseModel>> GetStockAllotments()
        {
            var inventorySpecification = new WMSInventorySpecification();
            var item = await _inventoryRepository.ListAsync(inventorySpecification);
            var allItems = item.Select(k => k.Row).Distinct().Select(row => new StockAllotmentResponseModel()
            {
                Row = row,
                OperatorId1 = 0,
                OperatorId2 = 0,
                OperatorName1 = string.Empty,
                OperatorName2 = string.Empty

            }).ToList();
            
            var specification = new StockAllotmentSpecification();
            var data = await _itemRepository.ListAsync(specification);
            var assignedItems = data.Select(i => new StockAllotmentResponseModel()
            {
                Row = i.Row,
                OperatorId1 = i.OperatorId1,
                OperatorId2 = i.OperatorId2,
                OperatorName1 = GetOperatorName(i.OperatorId1).Result,
                OperatorName2 = GetOperatorName(i.OperatorId2).Result
            }).ToList();

            var results = new List<StockAllotmentResponseModel>(assignedItems);
            results.AddRange(allItems.Where(p2 => assignedItems.All(p1 => p1.Row != p2.Row)));
            return results;
        }

        private async Task<string> GetOperatorName(long operatorId)
        {
            var userMaster = await _claimHandlerRepository.FindByPredicate(p => p.ID == operatorId);
            if (userMaster == null)
            {
                return string.Empty;
            }
            else
            {
                return userMaster[0].UserName;
            }
        }

        public async Task<List<StockAllotmentResponseModel>> GetAssignedStockAllotments()
        {
            var specification = new StockAllotmentSpecification();
            var item = await _itemRepository.ListAsync(specification);
            var assignedItems = item.Select(i => new StockAllotmentResponseModel() 
            { 
                Row = i.Row, 
                OperatorId1 = i.OperatorId1,
                OperatorId2 = i.OperatorId2
            }).ToList();
            
            return assignedItems;
        }        

        public async Task<List<StockAllotmentResponseModel>> GetUnassignedStockAllotments()
        {
            var inventorySpecification = new WMSInventorySpecification();
            var item = await _inventoryRepository.ListAsync(inventorySpecification);
            var allItems = item.Select(k => k.Row).Distinct().Select(row => new StockAllotmentResponseModel()
            {
                Row = row,
                OperatorId1 = 0,
                OperatorId2 = 0
            }).ToList();

            var specification = new StockAllotmentSpecification();
            var data = await _itemRepository.ListAsync(specification);
            var assignedItems = data.Select(i => new StockAllotmentResponseModel()
            {
                Row = i.Row,
                OperatorId1 = i.OperatorId1,
                OperatorId2 = i.OperatorId2
            }).ToList();

            var results = new List<StockAllotmentResponseModel>();
            results.AddRange(allItems.Where(p2 => assignedItems.All(p1 => p1.Row != p2.Row)));
            return results;
        }

        public async Task<bool> SaveStockAllotment(StockAllotmentRequestModel model)
        {
            var stockAllotment = await _itemRepository.FindByPredicate(p => p.Row == model.Row && !p.IsDelete);
            if (stockAllotment == null) 
            {
                return false;
            }
            else
            {
                StockAllotment stockAllotmentItem;
                if (stockAllotment.Count > 0)
                {
                    stockAllotmentItem = new StockAllotment
                    {
                        ID = stockAllotment[0].ID,
                        Row = stockAllotment[0].Row,
                        OperatorId1 = model.OperatorId1,
                        OperatorId2 = model.OperatorId2
                    };
                    await _itemRepository.UpdateAsync(stockAllotmentItem);
                }
                else
                {
                    stockAllotmentItem = new StockAllotment
                    {
                        ID = 0,
                        Row = model.Row,
                        OperatorId1 = model.OperatorId1,
                        OperatorId2 = model.OperatorId2
                    };
                    await _itemRepository.AddAsync(stockAllotmentItem);
                }                
                return true;
            }
        }       

        public async Task<List<OperatorInventoryResponse>> GetOperatorInventoryData(long operatorId)
        {
            var stockSpecification = new StockAllotmentSpecification(operatorId);
            var data = await _itemRepository.ListAsync(stockSpecification);
            var rowItems = data.Where(d=>d.OperatorId1 == operatorId).Select(i=>i.Row).ToList();

            var inventorySpecification = new WMSInventorySpecification(rowItems);
            var item = await _inventoryRepository.ListAsync(inventorySpecification);
            return item.Select(k => new OperatorInventoryResponse
            {
                WMSInventoryID = k.ID,
                Row = k.Row,
                Date = k.Date,
                SNo = k.SNo,
                Location = k.loc,
                MovibleUnit = k.MovibleUnit,
                Sku = k.Sku,
                Description = k.Desc,
                Lot = k.Batchcode,
                Expdate = k.Expdate,
                Serialkey = k.Serialkey,
                OnHand_WMS = k.Onhand,
                ActualA = k.ActualA,
                ActualB = k.ActualB,
                DiffA = k.DiffA,
                ActualFinal = k.ActualFinal,
                DiffFinal = k.DiffFinal,                
                IsEdit = false,
                ActualAUpdated = k.ActualAUpdated,
                ActualBUpdated = k.ActualBUpdated                
            }).ToList();
        }

        public async Task<List<OperatorInventoryResponse>> GetOperator2InventoryData(long operatorId)
        {
            var stockSpecification = new StockAllotmentSpecification(operatorId);
            var data = await _itemRepository.ListAsync(stockSpecification);
            var rowItems = data.Where(d => d.OperatorId2 == operatorId).Select(i => i.Row).ToList();
            
            var inventorySpecification = new WMSInventorySpecification(rowItems);
            var item = await _inventoryRepository.ListAsync(inventorySpecification);
            return item.Select(k => new OperatorInventoryResponse
            {
                WMSInventoryID = k.ID,
                Row = k.Row,
                Date = k.Date,
                SNo = k.SNo,
                Location = k.loc,
                MovibleUnit = k.MovibleUnit,
                Sku = k.Sku,
                Description = k.Desc,
                Lot = k.Batchcode,
                Expdate = k.Expdate,
                Serialkey = k.Serialkey,
                OnHand_WMS = k.Onhand,
                ActualA = k.ActualA,
                ActualB = k.ActualB,
                DiffA = k.DiffA,
                ActualFinal = k.ActualFinal,
                DiffFinal = k.DiffFinal,
                IsEdit = false,
                ActualAUpdated = k.ActualAUpdated,
                ActualBUpdated = k.ActualBUpdated
            }).ToList();
        }

        //public async Task<bool> UpdateOper1StockRowStart(RowRequestModel model)
        //{
        //    bool result = false;
        //    var stockAllotment = await _itemRepository.FindByPredicate(p => p.Row == model.Row && !p.IsDelete);
        //    if(stockAllotment != null && stockAllotment.Count > 0)
        //    {
        //        var stockAllotmentItem = stockAllotment.First();
        //        stockAllotmentItem.IsOper1Start = true;
        //        await _itemRepository.UpdateAsync(stockAllotmentItem);
        //        result = true;
        //    }
        //    return result;
        //}

        //public async Task<bool> CheckOerator1RowInProcess(long operatorId)
        //{
        //    bool isRowInProcess = false;
        //    var specification = new StockAllotmentSpecification(operatorId: operatorId, isOper1Start: true, isOper1Complete: false, isDelete: false);
        //    var data = await _itemRepository.ListAsync(specification);
        //    if(data != null && data.Count > 0) 
        //    {
        //        isRowInProcess = true;
        //    }
        //    return isRowInProcess;
        //}

        public async Task<bool> UpdateOerator1RowComplete(long operatorId)
        {
            bool isRowComplete = false;
            var specification = new StockAllotmentSpecification(operatorId:operatorId, isOper1Start:true, isOper1Complete:false, isDelete:false);
            var rowdata = await _itemRepository.ListAsync(specification);
            if (rowdata != null && rowdata.Count > 0)
            {
                var item = rowdata[0];
                if (item != null)
                {
                    bool isAllActualAUpdated = false;                    
                    if (!string.IsNullOrEmpty(item.Row))
                    {                        
                        var inventorySpecification = new WMSInventorySpecification(rowItem: item.Row, actualAUpdated: false, isDelete: false);
                        var lstInventory = await _inventoryRepository.ListAsync(inventorySpecification);
                        if(lstInventory != null && lstInventory.Count == 0)
                        {
                            isAllActualAUpdated = true;
                        }
                    }

                    if (isAllActualAUpdated)
                    {
                        item.IsOper1Complete = true;
                        await _itemRepository.UpdateAsync(item);
                        isRowComplete = true;
                    }
                    else
                    {
                        isRowComplete = false;
                    }
                }
            }
            return isRowComplete;
        }

        public async Task<bool> CheckAndUpdateOper1RowInProcess(RowRequestModel model)
        {
            bool isRowInProcess = false;
            var stockAllotment = await _itemRepository.FindByPredicate(p => p.Row == model.Row && !p.IsDelete);
            if (stockAllotment != null && stockAllotment.Count > 0)
            {
                var stockItem = stockAllotment.First();
                if (!stockItem.IsOper1Start && !stockItem.IsOper1Complete)
                {
                    isRowInProcess = false;
                    stockItem.IsOper1Start = true;
                    await _itemRepository.UpdateAsync(stockItem);
                }
                else
                {
                    if (stockItem.IsOper1Start && !stockItem.IsOper1Complete)
                    {
                        isRowInProcess = true;
                    }
                }
            }
            return isRowInProcess;
        }

        //public async Task<bool> CheckOerator2RowInProcess(long operatorId)
        //{
        //    bool isRowInProcess = false;
        //    var specification = new StockAllotmentSpecification(operatorId: operatorId, isOper1Start: true, isOper1Complete: true, isOper2Start: true, isOper2Complete: false, isDelete: false);
        //    var data = await _itemRepository.ListAsync(specification);
        //    if (data != null && data.Count > 0)
        //    {
        //        isRowInProcess = true;
        //    }
        //    return isRowInProcess;
        //}

        //public async Task<bool> UpdateOper2StockRowStart(RowRequestModel model)
        //{
        //    bool result = false;
        //    var stockAllotment = await _itemRepository.FindByPredicate(p => p.Row == model.Row && !p.IsDelete);
        //    if (stockAllotment != null && stockAllotment.Count > 0)
        //    {
        //        var stockAllotmentItem = stockAllotment.First();
        //        stockAllotmentItem.IsOper2Start = true;
        //        await _itemRepository.UpdateAsync(stockAllotmentItem);
        //        result = true;
        //    }
        //    return result;
        //}

        public async Task<bool> CheckAndUpdateOper2RowInProcess(RowRequestModel model)
        {
            bool isRowInProcess = false;
            var stockAllotment = await _itemRepository.FindByPredicate(p => p.Row == model.Row && (p.IsOper1Start && p.IsOper1Complete) && !p.IsDelete);
            if (stockAllotment != null && stockAllotment.Count > 0)
            {
                var stockItem = stockAllotment.First();
                if(!stockItem.IsOper2Start && !stockItem.IsOper2Complete)
                {
                    isRowInProcess = false;
                    stockItem.IsOper2Start = true;
                    await _itemRepository.UpdateAsync(stockItem);
                }
                else
                {
                    if(stockItem.IsOper2Start && !stockItem.IsOper2Complete)
                    {
                        isRowInProcess = true;
                    }
                }
            }
            return isRowInProcess;
        }

        public async Task<bool> UpdateOerator2RowComplete(long operatorId)
        {
            bool isRowComplete = false;
            var specification = new StockAllotmentSpecification(operatorId: operatorId, isOper1Start: true, isOper1Complete: true, isOper2Start: true, isOper2Complete: false, isDelete: false);
            var rowdata = await _itemRepository.ListAsync(specification);
            if (rowdata != null && rowdata.Count > 0)
            {
                var item = rowdata[0];
                if (item != null)
                {
                    bool isAllActualBUpdated = false;
                    if (!string.IsNullOrEmpty(item.Row))
                    {
                        var inventorySpecification = new WMSInventorySpecification(rowItem: item.Row, actualAUpdated: true, actualBUpdated: false, isDelete: false);
                        var lstInventory = await _inventoryRepository.ListAsync(inventorySpecification);
                        if (lstInventory != null && lstInventory.Count == 0)
                        {
                            isAllActualBUpdated = true;
                        }
                    }

                    if (isAllActualBUpdated)
                    {
                        item.IsOper2Complete = true;
                        await _itemRepository.UpdateAsync(item);
                        isRowComplete = true;
                    }
                    else
                    {
                        isRowComplete = false;
                    }
                }
            }
            return isRowComplete;
        }        

        public async Task<List<string?>> GetOperator1StockAllotments(long operatorId)
        {
            StockAllotmentSpecification specification = new StockAllotmentSpecification(operatorId: operatorId, isOper1Start: true, isOper1Complete: false, isDelete: false);
            var items = await _itemRepository.ListAsync(specification);
            if(!items.Any())
            {
                specification = new StockAllotmentSpecification(operatorId: operatorId, isOper1Start: false, isOper1Complete: false, isDelete: false);
                items = await _itemRepository.ListAsync(specification);
            }
            var result = items.Select(k => k.Row).Distinct().ToList();
            return result;
        }

        public async Task<List<string?>> GetOperator2StockAllotments(long operatorId)
        {
            StockAllotmentSpecification specification = new StockAllotmentSpecification(operatorId: operatorId, isOper1Start: true, isOper1Complete: true, isOper2Start: true, isOper2Complete: false, isDelete: false);
            var items = await _itemRepository.ListAsync(specification);
            if (!items.Any())
            {
                specification = new StockAllotmentSpecification(operatorId: operatorId, isOper1Start: true, isOper1Complete: true, isOper2Start: false, isOper2Complete: false, isDelete: false);
                items = await _itemRepository.ListAsync(specification);
            }
            var result = items.Select(k => k.Row).Distinct().ToList();
            return result;
        }

        public async Task<List<string?>> GetSupervisorSubmitStockRow()
        {
            var specification = new StockAllotmentSpecification(isOper1Start: true, isOper1Complete: true, isOper2Start: true, isOper2Complete: true, isSupervisorSubmit: false, isDelete: false);
            var items = await _itemRepository.ListAsync(specification);
            var result = items.Select(k => k.Row).Distinct().ToList();
            return result;
        }

        public async Task<bool> SubmitStockRowBySupervisor(RowRequestModel model)
        {
            var specification = new StockAllotmentSpecification(row: model.Row, isOper1Start: true, isOper1Complete: true, isOper2Start: true, isOper2Complete: true, isDelete: false);
            var items = await _itemRepository.ListAsync(specification);
            if (items.Any())
            {
                var stockItem = items.First();
                stockItem.IsSupervisorSubmit = true;
                await _itemRepository.UpdateAsync(stockItem);
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<List<string?>> GetManagerSubmitStockRow()
        {
            var specification = new StockAllotmentSpecification(isOper1Start: true, isOper1Complete: true, isOper2Start: true, isOper2Complete: true, isSupervisorSubmit: true, isManagerFinalize: false, isDelete: false);
            var items = await _itemRepository.ListAsync(specification);
            var result = items.Select(k => k.Row).Distinct().ToList();
            return result;
        }

        public async Task<bool> SubmitStockRowByManager(RowRequestModel model)
        {
            var specification = new StockAllotmentSpecification(row: model.Row, isOper1Start: true, isOper1Complete: true, isOper2Start: true, isOper2Complete: true, isSupervisorSubmit: true, isDelete: false);
            var items = await _itemRepository.ListAsync(specification);
            if (items.Any())
            {
                var stockItem = items.First();
                stockItem.IsManagerFinalize = true;
                await _itemRepository.UpdateAsync(stockItem);
                return true;
            }
            else
            {
                return false;
            }
        }
    }    

}
