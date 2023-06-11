using Herbalife.Stock.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Herbalife.Stock.Core.Entities
{
    public class GroupMaster : EntityBase, IAggregateRoot
    {
        public string GroupName { get; set; }
    }
}
