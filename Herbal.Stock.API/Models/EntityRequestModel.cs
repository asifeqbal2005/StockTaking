namespace Herbal.Stock.API.Models
{
    public class EntityRequestModel
    {
        public long? ID { get; set; }
        public string EntityName { get; set; }
        public string Description { get; set; }
        public string RouterLink { get; set; }
        public bool? IsParent { get; set; }
        public long? ParentId { get; set; }        
        public int DisplayOrder { get; set; }
        public string EntityIcon { get; set; }
        public bool AssignPermission { get; set; }
    }
}
