using Herbalife.Stock.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Herbalife.Stock.Core.Entities
{
    public class UserPermission : EntityBase, IAggregateRoot
    {
        public long UserId { get; set; }
    }
}
