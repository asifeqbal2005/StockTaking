using Herbalife.Stock.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Herbalife.Stock.Core.Specifications
{
    public class LocationFilterSpecification : BaseSpecification<Location>
    {
        public LocationFilterSpecification(bool isDelete = false)
           : base(i => (i.IsDelete == isDelete))
        {
            AddInclude(k => k.Country);
        }
    }
}
