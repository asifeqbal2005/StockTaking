using Herbalife.Stock.Core.Interfaces;

namespace Herbalife.Stock.Core.Entities
{
    public class UserGroupPermission : EntityBase, IAggregateRoot
    {
        public long UserGroupId { get; set; }
        public long EntityMasterId { get; set; }
        public string EntityPermission { get; set; }
        public virtual GroupMaster UserGroup { get; set; }
        public virtual EntityMaster EntityMaster { get; set; }
    }
}
