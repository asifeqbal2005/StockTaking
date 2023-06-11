using Herbalife.Stock.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Herbalife.Stock.Core.Entities
{
    public class WMSInventory : EntityBase, IAggregateRoot
    {
        public DateTime Date { get; set; }
        public string? Subinventory { get; set; }
        public string? Chamber { get; set; }
        public string? Level { get; set; }
        public Int64 SNo { get; set; }
        public string? Form { get; set; }
        public string? Storerkey { get; set; }
        public string? loc { get; set; }
        public string? MovibleUnit { get; set; }
        public string? Sku { get; set; }
        public string? Desc { get; set; }
        public string? Batchcode { get; set; }
        public string? Expdate { get; set; }
        public string? Busr10 { get; set; }
        public string? Remarks { get; set; }
        public string? Sectionkey { get; set; }
        public string? Row { get; set; }
        public string? Serialkey { get; set; }
        public int Onhand { get; set; }
        public int Allocated { get; set; }
        public int Picked { get; set; }
        public int Available { get; set; }
        public int ActualA { get; set; }
        public int DiffA { get; set; }
        public int ActualB { get; set; }
        public int ActualFinal { get; set; }
        public int DiffFinal { get; set; }
        public bool ActualAUpdated { get; set; }
        public bool ActualBUpdated { get; set; }
        public string? Discrepancy { get; set; }
    }
}
