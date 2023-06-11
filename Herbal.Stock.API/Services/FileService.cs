using AutoMapper;
using Herbal.Stock.API.Interfaces;
using Herbal.Stock.API.Models;
using Herbalife.Stock.Core.Entities;
using Herbalife.Stock.Core.Interfaces;
using Herbalife.Stock.Core.Specifications;
using OfficeOpenXml;

namespace Herbal.Stock.API.Services
{
    public class FileService : IFileService
    {
        private readonly IAsyncRepository<WMSInventory> _inventoryRepository;
        private readonly IAsyncRepository<StockOnHandOracle> _oracleInventoryRepository;
        private readonly IMapper _mapper;

        public FileService(IAsyncRepository<WMSInventory> inventoryRepository, IAsyncRepository<StockOnHandOracle> oracleInventoryRepository, IMapper mapper)
        {
            _inventoryRepository = inventoryRepository;
            _oracleInventoryRepository = oracleInventoryRepository;
            _mapper = mapper;
        }   

        public async Task<List<InventoryResponseModel>> GetInventoryDetails()
        {
            var specification = new WMSInventorySpecification();
            var item = await _inventoryRepository.ListAsync(specification);
            return item.Select(k => new InventoryResponseModel
            {
                WMSInventoryID = k.ID,
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
                Row = k.Row

            }).ToList();
        }        

        public async Task<List<InventoryResponseModel>> UploadWMSInventoryAsync(IFormFile fileData)
        {
            string fileExtension = Path.GetExtension(fileData.FileName);
            if (fileExtension == ".xls" || fileExtension == ".xlsx")
            {
                using (var stream = new MemoryStream())
                {
                    fileData.CopyTo(stream);
                    stream.Position = 0;
                    using (ExcelPackage package = new ExcelPackage(stream))
                    {
                        ExcelWorksheet workSheet = package.Workbook.Worksheets["Data Input"];
                        int totalRows = workSheet.Dimension.Rows;
                        if (totalRows > 0)
                        {
                            List<WMSInventory> dataList = new List<WMSInventory>();
                            for (int i = 2; i <= totalRows; i++)
                            {
                                dataList.Add(new WMSInventory
                                {
                                    Date = Convert.ToDateTime(workSheet.Cells[i, 1].Text.ToString()),
                                    Subinventory = workSheet.Cells[i, 2].Value.ToString(),
                                    Chamber = workSheet.Cells[i, 3].Value.ToString(),
                                    Level = workSheet.Cells[i, 5].Value.ToString(),
                                    SNo = Convert.ToInt64(workSheet.Cells[i, 7].Value.ToString()),
                                    Form = workSheet.Cells[i, 8].Value.ToString(),
                                    Storerkey = workSheet.Cells[i, 9].Value.ToString(),
                                    loc = workSheet.Cells[i, 10].Value.ToString(),
                                    MovibleUnit = workSheet.Cells[i, 11].Value == null ? string.Empty : workSheet.Cells[i, 11].Value.ToString(),
                                    Sku = workSheet.Cells[i, 12].Value.ToString(),
                                    Desc = workSheet.Cells[i, 13].Value.ToString(),
                                    Batchcode = workSheet.Cells[i, 14].Value.ToString(),
                                    Expdate = workSheet.Cells[i, 15].Value.ToString(),
                                    Busr10 = workSheet.Cells[i, 16].Value.ToString(),
                                    Remarks = workSheet.Cells[i, 17].Value == null ? string.Empty : workSheet.Cells[i, 17].Value.ToString(),
                                    Sectionkey = workSheet.Cells[i, 18].Value.ToString(),
                                    Row = workSheet.Cells[i, 19].Value.ToString(),
                                    Serialkey = workSheet.Cells[i, 20].Value.ToString(),
                                    Onhand = Convert.ToInt32(workSheet.Cells[i, 21].Value.ToString()),
                                    Allocated = Convert.ToInt32(workSheet.Cells[i, 22].Value.ToString()),
                                    Picked = Convert.ToInt32(workSheet.Cells[i, 23].Value.ToString()),
                                    Available = Convert.ToInt32(workSheet.Cells[i, 24].Value.ToString()),
                                    ActualA = workSheet.Cells[i, 25].Value == null? 0 : Convert.ToInt32(workSheet.Cells[i, 25].Value.ToString()),
                                    DiffA = workSheet.Cells[i, 26].Value == null? 0 : Convert.ToInt32(workSheet.Cells[i, 26].Value.ToString()),
                                    ActualB = workSheet.Cells[i, 27].Value == null? 0 : Convert.ToInt32(workSheet.Cells[i, 27].Value.ToString()),
                                    ActualFinal = workSheet.Cells[i, 28].Value == null? 0 : Convert.ToInt32(workSheet.Cells[i, 28].Value.ToString()),
                                    DiffFinal = workSheet.Cells[i, 29].Value == null? 0 : Convert.ToInt32(workSheet.Cells[i, 29].Value.ToString()),
                                });
                            }

                            if (dataList.Count > 0)
                            {
                                await _inventoryRepository.AddRangeAsync(dataList);
                                
                                //await _inventoryRepository.AddAsync(dataList)
                                //this.dbContextClass.Set<WMSInventory>().AddRange(dataList);
                                //await this.dbContextClass.SaveChangesAsync();
                            }
                        }
                    }
                }
            }

            return await this.GetInventoryDetails();
        }

        public async Task<List<string?>> GetRowDataToFilter()
        {
            var specification = new WMSInventorySpecification();
            var item = await _inventoryRepository.ListAsync(specification);
            var result = item.Select(k => k.Row).Distinct().ToList();
            return result;
        }

        public async Task<List<SupervisorInventoryResponse>> GetSupervisorInventoryData()
        {
            var specification = new WMSInventorySpecification();
            var item = await _inventoryRepository.ListAsync(specification);
            return item.Select(k => new SupervisorInventoryResponse
            {
                WMSInventoryID = k.ID,
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
                Row = k.Row,
                IsEdit = false,
                Discrepancy = k.Discrepancy

            }).ToList();
        }

        public async Task<bool> UpdateInventoryData(UpdateInventoryModel model)
        {
            var item = await _inventoryRepository.GetByIdAsync(model.WMSInventoryID);
            if (item != null)
            {
                item.Onhand = model.OnHand_WMS;
                item.ActualA = model.ActualA;
                item.ActualB = model.ActualB;
                item.DiffA = model.DiffA;
                item.ActualFinal = model.ActualFinal;
                item.DiffFinal = model.DiffFinal;
                item.ActualAUpdated = !item.ActualAUpdated ? model.ActualAUpdated : item.ActualAUpdated;
                item.ActualBUpdated = !item.ActualBUpdated ? model.ActualBUpdated : item.ActualBUpdated;
                item.Discrepancy = model.Discrepancy;

                await _inventoryRepository.UpdateAsync(item);
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<List<StockOnHandInventoryModel>> GetStockOnHandInventory()
        {
            var specification = new WMSInventorySpecification();
            var item = await _inventoryRepository.ListAsync(specification);
            return item.Select(k => new StockOnHandInventoryModel
            {                
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
                DiffFinal = k.DiffFinal               

            }).ToList();
        }


        public async Task<List<InventoryDtoModel>> UploadOracleInventoryAsync(IFormFile fileData)
        {
            string fileExtension = Path.GetExtension(fileData.FileName);
            if (fileExtension == ".xls" || fileExtension == ".xlsx")
            {
                using (var stream = new MemoryStream())
                {
                    fileData.CopyTo(stream);
                    stream.Position = 0;
                    using (ExcelPackage package = new ExcelPackage(stream))
                    {
                        ExcelWorksheet workSheet = package.Workbook.Worksheets[1];
                        int totalRows = workSheet.Dimension.Rows;
                        if (totalRows > 0)
                        {
                            List<StockOnHandOracle> dataList = new List<StockOnHandOracle>();
                            for (int i = 2; i <= totalRows; i++)
                            {
                                dataList.Add(new StockOnHandOracle
                                {
                                    SNo = Convert.ToInt64(workSheet.Cells[i, 7].Value.ToString()),                                    
                                    Location = workSheet.Cells[i, 10].Value.ToString(),
                                    MovibleUnit = workSheet.Cells[i, 11].Value == null ? string.Empty : workSheet.Cells[i, 11].Value.ToString(),
                                    Sku = workSheet.Cells[i, 12].Value.ToString(),
                                    Description = workSheet.Cells[i, 13].Value.ToString(),
                                    Lot = workSheet.Cells[i, 14].Value.ToString(),
                                    Expdate = workSheet.Cells[i, 15].Value.ToString(),                                    
                                    Serialkey = workSheet.Cells[i, 20].Value.ToString(),
                                    OnHand = Convert.ToInt32(workSheet.Cells[i, 21].Value.ToString()),                                    
                                    ActualA = workSheet.Cells[i, 25].Value == null ? 0 : Convert.ToInt32(workSheet.Cells[i, 25].Value.ToString()),
                                    DiffA = workSheet.Cells[i, 26].Value == null ? 0 : Convert.ToInt32(workSheet.Cells[i, 26].Value.ToString()),
                                    ActualB = workSheet.Cells[i, 27].Value == null ? 0 : Convert.ToInt32(workSheet.Cells[i, 27].Value.ToString()),
                                    ActualFinal = workSheet.Cells[i, 28].Value == null ? 0 : Convert.ToInt32(workSheet.Cells[i, 28].Value.ToString()),
                                    DiffFinal = workSheet.Cells[i, 29].Value == null ? 0 : Convert.ToInt32(workSheet.Cells[i, 29].Value.ToString()),
                                });
                            }

                            if (dataList.Count > 0)
                            {
                                await _oracleInventoryRepository.AddRangeAsync(dataList);
                            }
                        }
                    }
                }
            }
            
            var result = await CompareWMSAndOracleFile();
            return result;
        }

        //private async Task<List<OracleInventoryResponseModel>> GetOracleInventoryData()
        //{
        //    var specification = new StockOnHandOracleSpecification();
        //    var item = await _oracleInventoryRepository.ListAsync(specification);
        //    return item.Select(k => new OracleInventoryResponseModel
        //    {
        //        OracleInventoryID = k.ID,                
        //        SNo = k.SNo,
        //        Location = k.Location,
        //        MovibleUnit = k.MovibleUnit,
        //        Sku = k.Sku,
        //        Description = k.Description,
        //        Lot = k.Lot,
        //        Expdate = k.Expdate,
        //        Serialkey = k.Serialkey,
        //        OnHand = k.OnHand,
        //        ActualA = k.ActualA,
        //        DiffA = k.DiffA,
        //        ActualB = k.ActualB,                
        //        ActualFinal = k.ActualFinal,
        //        DiffFinal = k.DiffFinal
        //    }).ToList();
        //}

        private async Task<List<InventoryDtoModel>> CompareWMSAndOracleFile()
        {
            var wmsSpecification = new WMSInventorySpecification();
            var wmsItems = await _inventoryRepository.ListAsync(wmsSpecification);            
            var wmslist = wmsItems.Select(k => new InventoryDtoModel()
            {                
                Location = k.loc,                
                Sku = k.Sku,               
                OnHand = k.Onhand,
                ActualA = k.ActualA,
                ActualB = k.ActualB,
                DiffA = k.DiffA,
                ActualFinal = k.ActualFinal,
                DiffFinal = k.DiffFinal

            }).ToList();

            var oracleSpecification = new StockOnHandOracleSpecification();
            var oracleItems = await _oracleInventoryRepository.ListAsync(oracleSpecification);
            var oraclelist = oracleItems.Select(k => new InventoryDtoModel()
            {
                Location = k.Location,                
                Sku = k.Sku,                
                OnHand = k.OnHand,
                ActualA = k.ActualA,
                DiffA = k.DiffA,
                ActualB = k.ActualB,
                ActualFinal = k.ActualFinal,
                DiffFinal = k.DiffFinal

            }).ToList();

            //Comapre the Lists
            var result = wmslist.Except(oraclelist).Union(oraclelist.Except(wmslist)).ToList();
            return result;
        }

        
    }
}
