using Herbalife.Stock.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Herbalife.Stock.Core.Specifications
{
    public class EntityMasterSpecification : BaseSpecification<EntityMaster>
    {
        public EntityMasterSpecification(bool isDelete = false) : base(i =>
                (i.IsDelete == isDelete))
        {

        }

        public EntityMasterSpecification(bool assignPermission, bool isDelete = false) : base(i =>
                (i.AssignPermission == assignPermission) && (i.IsDelete == isDelete))
        {

        }

        public EntityMasterSpecification(long entityId, bool isDelete = false) : base(i => 
                 (i.ID == entityId) && (i.IsDelete == isDelete))
        {

        }
    }
}
