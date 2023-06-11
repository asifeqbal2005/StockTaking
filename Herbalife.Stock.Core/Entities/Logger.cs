using Herbalife.Stock.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Herbalife.Stock.Core.Entities
{
    public class Logger : EntityBase, IAggregateRoot
    {
        public string EntityName { get; set; }
        public string ActionName { get; set; }
        public string Error { get; set; }
        public string InnerException { get; set; }
        public string InnerExceptionMessage { get; set; }
        public string ErrorMessage { get; set; }
    }
}
