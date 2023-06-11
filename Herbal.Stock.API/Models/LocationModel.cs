using Herbalife.Stock.Core.Entities;

namespace Herbal.Stock.API.Models
{
    public class LocationRequestModel
    {
        public long? ID { get; set; }
        public string? LocationName { get; set; }
        public long CountryId { get; set; }
    }

    public class LocationResponseModel
    {
        public long LocationId { get; set; }
        public string? LocationName { get; set; }
        public long CountryId { get; set; }
        public string? CountryName { get; set; }
    }
}
