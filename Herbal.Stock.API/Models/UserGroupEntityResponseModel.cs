namespace Herbal.Stock.API.Models
{
    public class UserGroupEntityResponseModel
    {
        public string EntityName { get; set; }
        public long UserGroupId { get; set; }
        public string UserGroupName { get; set; }
        public string EntityPermission { get; set; }        
    }

    public class UserGroupEntityUpdateResponseModel
    {
        public long GroupID { get; set; }
        public string GroupName { get; set; }
        public bool isRecordExists { get; set; }
        public IList<EntityDropdownData> EntityData { get; set; }        
    }
}
