using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Herbalife.Stock.Core.Entities
{
    public class Audit
    {
        public Audit()
        {
            Id = Guid.NewGuid();
        }
        public Guid Id { get; set; }
        public string? TableName { get; set; }
        public DateTime UpdatedDateTime { get; set; }
        public string? KeyValues { get; set; }
        public string? OldValues { get; set; }
        public string? NewValues { get; set; }
    }
}
