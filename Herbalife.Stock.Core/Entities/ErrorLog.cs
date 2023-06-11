using Herbalife.Stock.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Herbalife.Stock.Core.Entities
{
    public class ErrorLog : EntityBase, IAggregateRoot
    {
        public DateTime LogDate { get; set; }
        public string Description { get; set; }
        public long ErrorLine { get; set; }
    }
}
