using Herbalife.Stock.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Herbalife.Stock.Core.Specifications
{
    public class UserGroupSpecification : BaseSpecification<UserGroup>
    {        

        public UserGroupSpecification(bool isDelete = false) : base(i => (i.IsDelete == isDelete))
        {
            AddInclude(r => r.ClaimHandler);
            AddInclude(r => r.GroupMaster);
        }

        public UserGroupSpecification(long userId, long groupId, bool isDelete = false)
            : base(r => (r.UserId == userId) && (r.GroupId == groupId) && (r.IsDelete == isDelete))
        {
            AddInclude(r => r.ClaimHandler);
            AddInclude(r => r.GroupMaster);
        }
    }
}
