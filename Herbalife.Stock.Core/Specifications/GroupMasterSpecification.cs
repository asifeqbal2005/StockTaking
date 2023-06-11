using Herbalife.Stock.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Herbalife.Stock.Core.Specifications
{
    public class GroupMasterSpecification : BaseSpecification<GroupMaster>
    {
        public GroupMasterSpecification(bool isDelete = false) : base(i => (i.IsDelete == isDelete))
        {
            
        }
    }
}
