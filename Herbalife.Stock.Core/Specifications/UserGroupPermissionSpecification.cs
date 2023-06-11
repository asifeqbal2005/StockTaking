using Herbalife.Stock.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Herbalife.Stock.Core.Specifications
{
    public class UserGroupPermissionSpecification : BaseSpecification<UserGroupPermission>
    {
        public UserGroupPermissionSpecification(IList<long> groupId, bool isDelete = false) :
           base(i => (groupId.Contains(i.UserGroupId)) && (i.IsDelete == isDelete))
        {
            AddInclude(r => r.UserGroup);
            AddInclude(r => r.EntityMaster);
        }

        public UserGroupPermissionSpecification(string entityName, bool isDelete = false) :
          base(i => (string.IsNullOrEmpty(entityName) || i.EntityMaster.EntityName.ToLower().Contains(entityName.ToLower())) && (i.IsDelete == isDelete))
        {
            AddInclude(r => r.UserGroup);
            AddInclude(r => r.EntityMaster);
        }
    }
}
