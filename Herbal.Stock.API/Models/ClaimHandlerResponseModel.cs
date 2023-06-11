namespace Herbal.Stock.API.Models
{
    public class ClaimHandlerResponseModel
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
        public bool? IsSelected { get; set; }
        public bool isRecordExists { get; set; }
    }
}
