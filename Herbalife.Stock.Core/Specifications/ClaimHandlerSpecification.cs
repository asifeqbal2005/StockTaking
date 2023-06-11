using Herbalife.Stock.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Herbalife.Stock.Core.Specifications
{
    public class ClaimHandlerSpecification : BaseSpecification<ClaimHandler>
    {
        public ClaimHandlerSpecification(long organisationId)
          : base(i => (organisationId == 0 || i.OrganisationId == organisationId))
        {

        }

        public ClaimHandlerSpecification(bool isDelete = false)
          : base(i => (i.IsDelete == isDelete))
        {

        }

        public ClaimHandlerSpecification(long? claimHandlerId, bool isDelete = false)
          : base(i => (i.ID == claimHandlerId) && (i.IsDelete == isDelete))
        {

        }
    }
}
