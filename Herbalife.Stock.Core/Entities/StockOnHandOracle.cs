using Herbalife.Stock.Core.Interfaces;

namespace Herbalife.Stock.Core.Entities
{
    public class StockOnHandOracle : EntityBase, IAggregateRoot
    {       
        public Int64 SNo { get; set; }
        public string? Location { get; set; }
        public string? MovibleUnit { get; set; }
        public string? Sku { get; set; }
        public string? Description { get; set; }
        public string? Lot { get; set; }
        public string? Expdate { get; set; }
        public string? Serialkey { get; set; }
        public int OnHand { get; set; }
        public int ActualA { get; set; }
        public int DiffA { get; set; }
        public int ActualB { get; set; }
        public int ActualFinal { get; set; }
        public int DiffFinal { get; set; }        
    }
}
