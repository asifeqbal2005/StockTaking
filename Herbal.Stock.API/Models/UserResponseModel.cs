namespace Herbal.Stock.API.Models
{
    public class ManageUserResponseModel
    {
        public long ID { get; set; }
        public long UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }        
        public long GroupId { get; set; }
        public string GroupName { get; set; }
        public bool IsDelete { get; set; }
    }
}
