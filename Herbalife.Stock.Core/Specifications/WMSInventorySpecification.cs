using Herbalife.Stock.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Herbalife.Stock.Core.Specifications
{
    public class WMSInventorySpecification : BaseSpecification<WMSInventory>
    {
        public WMSInventorySpecification(bool isDelete = false) : base(r => r.IsDelete == isDelete)
        {
        }

        public WMSInventorySpecification(long inventoryId, bool isDelete = false) : base(i =>
                 (i.ID == inventoryId) && (i.IsDelete == isDelete))
        {

        }

        public WMSInventorySpecification(string? rowItem, bool isDelete = false) : base(i =>
                 (i.Row == rowItem) && (i.IsDelete == isDelete))
        {

        }

        public WMSInventorySpecification(List<string?> rowItems, bool isDelete = false) : base(i =>
                 ((rowItems.Contains(i.Row)) && (i.IsDelete == isDelete)))
        {

        }

        public WMSInventorySpecification(string? rowItem, bool actualAUpdated, bool isDelete = false) : base(i =>
                 (i.Row == rowItem) && (i.ActualAUpdated == actualAUpdated) && (i.IsDelete == isDelete))
        {

        }

        public WMSInventorySpecification(string? rowItem, bool actualAUpdated, bool actualBUpdated, bool isDelete = false) : base(i =>
                 (i.Row == rowItem) && (i.ActualAUpdated == actualAUpdated) && (i.ActualBUpdated == actualBUpdated) && (i.IsDelete == isDelete))
        {

        }

    }
}
