using Herbalife.Stock.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Herbalife.Stock.Core.Specifications
{
    public class StockOnHandOracleSpecification : BaseSpecification<StockOnHandOracle>
    {
        public StockOnHandOracleSpecification(bool isDelete = false) : base(r => r.IsDelete == isDelete)
        {
        }
    }
}
