namespace Herbal.Stock.API.Models
{    

    public class UserGroupEntityRequestModel
    {
        public long? ID { get; set; }
        public long GroupId { get; set; }
        public IList<EntityDropdownData> EntityData { get; set; }
        
    }

    public class EntityDropdownData
    {
        public long ID { get; set; }
        public string Name { get; set; }
        public bool isSelected { get; set; }
        public bool isCreate { get; set; }
        public bool isRead { get; set; }
        public bool isUpdate { get; set; }
        public bool isDelete { get; set; }
    }

    public class UserGroupPermissionUpdateRequestModel
    {
        public long GroupId { get; set; }
        public IList<EntityDropdownData> EntityData { get; set; }        
    }
}
