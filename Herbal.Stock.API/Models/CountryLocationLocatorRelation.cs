namespace Herbal.Stock.API.Models
{
    public class CountryLocationLocatorRelation
    {
        public long CountryId { get; set; }
        public long? LocationId { get; set; }
        public long? LocatorId { get; set; }
        public string CountryName { get; set; }
        public string LocationName { get; set; }
        public string LocatorName { get; set; }
    }

    

}
