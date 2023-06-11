namespace Herbal.Stock.API.Models
{
    public class UserGroupResponseModel
    {
        public long GroupId { get; set; }
        public string GroupName { get; set; }
        public long UserId { get; set; }
        public bool IsSelected { get; set; }
        public long UserCount { get; set; }
    }    
}
