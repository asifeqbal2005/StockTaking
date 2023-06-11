namespace Herbal.Stock.API.Models
{
    public class StockAllotmentRequestModel
    {
        public string Row { get; set; }
        public long OperatorId1 { get; set; }
        public long OperatorId2 { get; set; }
    }

    public class RowRequestModel
    {
        public string Row { get; set; }
        //public bool IsOper1Start { get; set; }
        //public bool IsOper2Start { get; set; }
    }
}
