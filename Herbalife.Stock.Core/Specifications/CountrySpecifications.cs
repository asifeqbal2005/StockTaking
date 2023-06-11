using Herbalife.Stock.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Herbalife.Stock.Core.Specifications
{
    public class CountrySpecifications : BaseSpecification<Country>
    {
        public CountrySpecifications(bool isDelete = false) : base(i =>
                (i.IsDelete == isDelete))
        {

        }

        public CountrySpecifications(long countryId, bool isDelete = false) : base(i =>
                 (i.ID == countryId) && (i.IsDelete == isDelete))
        {

        }
    }
}
