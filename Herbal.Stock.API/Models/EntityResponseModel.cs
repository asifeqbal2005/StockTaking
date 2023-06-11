namespace Herbal.Stock.API.Models
{
    public class EntityResponseModel
    {
        public long? ID { get; set; }
        public string EntityName { get; set; }
        public string Description { get; set; }
        public string RouterLink { get; set; }
        public bool? IsParent { get; set; }
        public long? ParentId { get; set; }
        public string ParentName { get; set; }        
        public int DisplayOrder { get; set; }
        public string EntityIcon { get; set; }        
        public bool AssignPermission { get; set; }
    }

    public class EntityParentChildResponseModel
    {
        public string EntityName { get; set; }
        public string Description { get; set; }
        public string RouterLink { get; set; }
        public bool IsParent { get; set; }
        public int DisplayOrder { get; set; }
        public string EntityIcon { get; set; }
        //public string LabelId { get; set; }
        //public string LabelName { get; set; }
        //public string TranslatedText { get; set; }
        public IEnumerable<EntityParentChildResponseModel> ChildMenu { get; set; }
    }
}
