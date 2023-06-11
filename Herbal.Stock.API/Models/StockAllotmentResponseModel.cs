namespace Herbal.Stock.API.Models
{
    public class StockAllotmentResponseModel
    {
        public string? Row { get; set; }
        public long OperatorId1 { get; set; }
        public string? OperatorName1 { get; set; }
        public long OperatorId2 { get; set; }
        public string? OperatorName2 { get; set; }
        public bool IsOper1Start { get; set; }
        public bool IsOper2Start { get; set; }
        public bool IsOper1Complete { get; set; }
        public bool IsOper2Complete { get; set; }
    }
}
