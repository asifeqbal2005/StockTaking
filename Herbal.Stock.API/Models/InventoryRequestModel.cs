namespace Herbal.Stock.API.Models
{
    public class InventoryRequestModel
    {
        public long WMSInventoryID { get; set; }
        public string? Row { get; set; }
        public DateTime Date { get; set; }
        public Int64 SNo { get; set; }
        public string? Location { get; set; }
        public string? MovibleUnit { get; set; }
        public string? Sku { get; set; }
        public string? Description { get; set; }
        public string? Lot { get; set; }
        public string? Expdate { get; set; }
        public string? Serialkey { get; set; }
        public int OnHand_WMS { get; set; }
        public int ActualA { get; set; }
        public int DiffA { get; set; }
        public int ActualB { get; set; }
        public int ActualFinal { get; set; }
        public int DiffFinal { get; set; }
        public bool ActualAUpdated { get; set; }
        public bool ActualBUpdated { get; set; }
    }

    public class UpdateInventoryModel
    {
        public long WMSInventoryID { get; set; }
        public int OnHand_WMS { get; set; }
        public int ActualA { get; set; }
        public int ActualB { get; set; }
        public int DiffA { get; set; }
        public int ActualFinal { get; set; }
        public int DiffFinal { get; set; }
        public bool ActualAUpdated { get; set; }
        public bool ActualBUpdated { get; set; }
        public string? Discrepancy { get; set; }
    }
}
