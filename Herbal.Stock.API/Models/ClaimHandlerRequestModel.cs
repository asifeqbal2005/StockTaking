namespace Herbal.Stock.API.Models
{
    public class ClaimHandlerRequestModel
    {
        public long? ID { get; set; }
        public string OrganistaionId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Country { get; set; }
        public string Location { get; set; }
        public string Locator { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsDelete { get; set; }
    }
}
