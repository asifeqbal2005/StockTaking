namespace Herbal.Stock.API.Models
{
    public class ApplicationUserModel
    {
        public long UserID { get; set; }
        public long? OrganisationId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public long? Country { get; set; }
        public long? Location { get; set; }
        public long? Locator { get; set; }
        public bool IsAdmin { get; set; }
        public List<ApplicationPermissionModel> UserPermission { get; set; }
    }

    public class ApplicationPermissionModel
    {
        public string Permission { get; set; }
        public long EntityID { get; set; }
        public string EntityName { get; set; }
    }
}
