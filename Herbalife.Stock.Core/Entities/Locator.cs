using Herbalife.Stock.Core.Interfaces;

namespace Herbalife.Stock.Core.Entities
{
    public class Locator : EntityBase, IAggregateRoot
    {        
        public string LocatorName { get; set; }
        public long LocationId { get; set; }
        public virtual Location Location { get; set; }
    }
}
