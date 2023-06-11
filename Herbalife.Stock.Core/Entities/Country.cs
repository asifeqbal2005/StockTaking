using Herbalife.Stock.Core.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace Herbalife.Stock.Core.Entities
{
    public class Country : EntityBase, IAggregateRoot
    {        
        public string? CountryName { get; set; }
    }
}
