using Herbalife.Stock.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Herbalife.Stock.Core.Specifications
{
    public class AssignUserGroupFilterSpecifications : BaseSpecification<UserGroup>
    {
        public AssignUserGroupFilterSpecifications(string groupName, bool isDelete = false)
            : base(i => (string.IsNullOrEmpty(groupName) || i.GroupMaster.GroupName.ToLower() == groupName.ToLower())
               && (i.IsDelete == isDelete))
        {
            AddInclude(k => k.GroupMaster);
        }

        public AssignUserGroupFilterSpecifications(long userId, bool isDelete = false)
           : base(i => (i.UserId == userId) && (i.IsDelete == isDelete))
        {
            AddInclude(k => k.GroupMaster);
        }

        public AssignUserGroupFilterSpecifications(bool isDelete = false)
           : base(i => (i.IsDelete == isDelete))
        {
            AddInclude(k => k.GroupMaster);
        }
    }
}
