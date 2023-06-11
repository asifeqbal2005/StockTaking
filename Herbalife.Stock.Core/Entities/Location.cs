using Herbalife.Stock.Core.Interfaces;

namespace Herbalife.Stock.Core.Entities
{
    public class Location : EntityBase, IAggregateRoot
    {
        public string LocationName { get; set; }
        public long CountryId { get; set; }
        public Country Country { get; set; }
    }
}
