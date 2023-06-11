using Herbalife.Stock.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Herbalife.Stock.Core.Entities
{
    public class ClaimHandler : EntityBase, IAggregateRoot
    {
        public long? OrganisationId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public long? CountryId { get; set; }
        public long? LocationId { get; set; }
        public long? LocatorId { get; set; }
        public bool IsAdmin { get; set; } = false;
    }
}
