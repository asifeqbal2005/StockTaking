using Herbalife.Stock.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Herbalife.Stock.Core.Entities
{
    public class UserGroup : EntityBase, IAggregateRoot
    {
        public long UserId { get; set; }
        public long GroupId { get; set; }
        public ClaimHandler ClaimHandler { get; set; }
        public GroupMaster GroupMaster { get; set; }
    }
}
