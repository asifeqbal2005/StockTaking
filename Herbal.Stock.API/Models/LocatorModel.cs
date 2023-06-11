namespace Herbal.Stock.API.Models
{   

    public class LocatorRequestModel
    {
        public long? ID { get; set; }
        public string? LocatorName { get; set; }
        public long LocationId { get; set; }
    }

    public class LocatorResponseModel
    {
        public long LocatorId { get; set; }
        public string? LocatorName { get; set; }
        public long LocationId { get; set; }
        public string? LocationName { get; set; }
    }
}
