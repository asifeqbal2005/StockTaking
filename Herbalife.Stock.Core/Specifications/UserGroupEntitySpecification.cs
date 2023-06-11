using Herbalife.Stock.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Herbalife.Stock.Core.Specifications
{
    public class UserGroupEntitySpecification : BaseSpecification<UserGroupPermission>
    {
        public UserGroupEntitySpecification(bool isDelete = false) : base(r => r.IsDelete == isDelete)
        {
            AddInclude(r => r.UserGroup);
            AddInclude(r => r.EntityMaster);
        }

        public UserGroupEntitySpecification(long groupId, bool isDelete = false) : base(r => (r.UserGroupId == groupId) && (r.IsDelete == isDelete))
        {
            AddInclude(r => r.UserGroup);
            AddInclude(r => r.EntityMaster);
        }
    }
}
