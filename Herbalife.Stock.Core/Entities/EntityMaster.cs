using Herbalife.Stock.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Herbalife.Stock.Core.Entities
{
    public class EntityMaster : EntityBase, IAggregateRoot
    {
        public string EntityName { get; set; }
        public string Description { get; set; }
        public string RouterLink { get; set; }
        public bool? IsParent { get; set; }
        public long? ParentId { get; set; }
        public int DisplayOrder { get; set; }
        public string EntityIcon { get; set; }
        public bool AssignPermission { get; set; }
    }
}
